using System;
using System.Collections.Concurrent;
using System.IO;
using System.IO.Pipes;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Arise.FileSyncer.Common;
using Arise.FileSyncer.Core;
using Arise.FileSyncer.Service.Ipc.Messages;

namespace Arise.FileSyncer.Service.Ipc
{
    internal class IpcController : IDisposable
    {
        public bool AcceptConnections = true;

        public readonly SyncerService Service;

        private readonly NamedPipeServerStream ipcReceiver;
        private NamedPipeServerStream ipcSender;
        private volatile bool receiverConnected = false;
        private volatile bool senderConnected = false;

        private readonly ConcurrentQueue<IpcMessage> senderQueue;
        private readonly AutoResetEvent sendEvent;

        private readonly object connectLock = new();

        public IpcController(SyncerService service)
        {
            Service = service;

            senderQueue = new ConcurrentQueue<IpcMessage>();
            sendEvent = new AutoResetEvent(false);

            // Dedicated pipes for in and outgoing messages are needed! To support Node-IPC, InOut mode is needed!
            ipcReceiver = new NamedPipeServerStream("AriseFileSyncerToServicePipe", PipeDirection.InOut); // In
            ipcSender = new NamedPipeServerStream("AriseFileSyncerFromServicePipe", PipeDirection.InOut); // Out

            Task.Factory.StartNew(Receiver, TaskCreationOptions.LongRunning);
            Task.Factory.StartNew(Sender, TaskCreationOptions.LongRunning);

            Service.ProgressTracker.ProgressUpdate += ProgressTracker_ProgressUpdate;

            Service.Peer.ConnectionAdded += (s, e) => Send(new ConnectionAddedMessage().Fill(e));
            Service.Peer.ConnectionVerified += (s, e) => Send(new ConnectionVerifiedMessage().Fill(e));
            Service.Peer.ConnectionRemoved += (s, e) => Send(new ConnectionRemovedMessage().Fill(e));
            Service.Peer.ProfileReceived += (s, e) => Send(new ReceivedProfileMessage().Fill(e));
            Service.Peer.ProfileAdded += (s, e) => Send(new ProfileAddedMessage().Fill(e));
            Service.Peer.ProfileChanged += (s, e) => Send(new ProfileChangedMessage().Fill(e));
            Service.Peer.ProfileRemoved += (s, e) => Send(new ProfileRemovedMessage().Fill(e));
            Service.Peer.PairingRequest += (s, e) =>
            {
                Log.Info("Auto accepting pair: " + e.DisplayName);
                e.ResultCallback(true);
            };
        }

        public void Send(IpcMessage message)
        {
            if (ipcSender.IsConnected)
            {
                senderQueue.Enqueue(message);
                sendEvent.Set();
            }
        }

        private void ProgressTracker_ProgressUpdate(object sender, ProgressUpdateEventArgs e)
        {
            if (ipcSender.IsConnected) Send(new UpdateMessage().Fill(this, e));
        }

        private void OnMessageReceived(IpcMessage message)
        {
            Log.Debug($"Received message: {message.Command}");
            message.Process(this);
        }

        private void DisconnectReceiver()
        {
            lock (connectLock)
            {
                if (receiverConnected)
                {
                    receiverConnected = false;
                    ipcReceiver.Disconnect();
                    LogDisconnect();
                }
            }
        }

        private void DisconnectSender()
        {
            lock (connectLock)
            {
                if (senderConnected)
                {
                    senderConnected = false;
                    ipcSender.Disconnect();
                    sendEvent.Set();
                    LogDisconnect();
                }
            }
        }

        private void LogConnect()
        {
            if (senderConnected && receiverConnected)
            {
                Log.Info("Application connected via IPC");
            }
        }

        private void LogDisconnect()
        {
            if (!senderConnected && !receiverConnected)
            {
                Log.Info("Application disconnected from IPC");
            }
        }

        private void Sender()
        {
            while (AcceptConnections)
            {
                try
                {
                    ipcSender.WaitForConnection();
                }
                catch (Exception ex)
                {
                    Log.Error("IPC (S) Error: " + ex.Message);

                    // Fix pipe?
                    ipcSender.Disconnect();
                    ipcSender.Dispose();
                    ipcSender = new NamedPipeServerStream("AriseFileSyncerFromServicePipe", PipeDirection.InOut);

                    continue;
                }

                lock (connectLock)
                {
                    senderConnected = true;
                    LogConnect();
                }

                while (ipcSender.IsConnected)
                {
                    while (!senderQueue.IsEmpty)
                    {
                        if (senderQueue.TryDequeue(out IpcMessage message))
                        {
                            string json = Json.Serialize(message) + "\n";
                            byte[] binaryJson = Encoding.UTF8.GetBytes(json);

                            try
                            {
                                ipcSender.Write(binaryJson, 0, binaryJson.Length);
                            }
                            catch (Exception ex)
                            {
                                Log.Error("IPC Write error: " + ex.Message);
                                break;
                            }
                        }
                    }

                    if (ipcSender.IsConnected) sendEvent.WaitOne();
                }

                DisconnectReceiver();
                DisconnectSender();

                // Clear senderQueue
                senderQueue.Clear();
            }
        }

        private void Receiver()
        {
            while (AcceptConnections)
            {
                try
                {
                    ipcReceiver.WaitForConnection();
                }
                catch (Exception ex)
                {
                    Log.Error("IPC (R) Error: " + ex.Message);
                    continue;
                }

                lock (connectLock)
                {
                    receiverConnected = true;
                    LogConnect();
                }

                // It can be left without dispose. (?)
                StreamReader reader = new(ipcReceiver);
                IpcMessage message = null;

                while (ipcReceiver.IsConnected)
                {
                    try
                    {
                        string json = reader.ReadLine();
                        if (!string.IsNullOrEmpty(json))
                        {
                            string command = ReadCommand(json);
                            message = IpcMessageFactory.Create(command);
                            Json.FillObject(message, json);
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.Error("IPC Read error: " + ex.Message);
                        break;
                    }

                    if (message != null) OnMessageReceived(message);

                    message = null;
                }

                reader.DiscardBufferedData();

                DisconnectReceiver();
                DisconnectSender();
            }
        }

        private static string ReadCommand(string json)
        {
            if (json.StartsWith("{\"Command\":", StringComparison.Ordinal))
            {
                string subJson = json[12..];
                int endIndex = subJson.IndexOf('"');
                return subJson.Substring(0, endIndex);
            }
            else
            {
                throw new Exception("Invalid Json");
            }
        }

        #region IDisposable Support
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO do a proper shutdown
                    ipcReceiver?.Dispose();
                    ipcSender?.Dispose();
                    sendEvent.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}
