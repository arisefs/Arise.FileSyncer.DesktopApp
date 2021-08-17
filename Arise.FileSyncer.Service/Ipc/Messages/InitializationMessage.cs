using System;
using System.Collections.Generic;
using Arise.FileSyncer.Core;
using Arise.FileSyncer.Service.Ipc.DataModels;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class InitializationMessage : IpcMessage
    {
        public override string Command => "initialization";

        public string DisplayName { get; set; }
        public List<ProfileData> Profiles { get; set; }
        public ConnectionData[] Connections { get; set; }

        internal IpcMessage Fill(IpcController ipc)
        {
            DisplayName = ipc.Service.Peer.Settings.DisplayName;

            Profiles = new List<ProfileData>();
            foreach (var kv in ipc.Service.Peer.Profiles.Snapshot())
            {
                Profiles.Add(new ProfileData(kv.Key, kv.Value));
            }

            Connections = ConnectionData.CreateArray(ipc.Service.Peer);
            return this;
        }

        public class ConnectionData
        {
            public Guid Id { get; set; }
            public bool Verified { get; set; }
            public string Name { get; set; }

            public static ConnectionData[] CreateArray(SyncerPeer peer)
            {
                List<ConnectionData> list = new();

                foreach (Guid id in peer.Connections.GetConnectionIds())
                {
                    if (peer.Connections.TryGetConnection(id, out ISyncerConnection connection))
                    {
                        list.Add(new ConnectionData()
                        {
                            Id = id,
                            Verified = connection.Verified,
                            Name = connection.DisplayName,
                        });
                    }
                }

                return list.ToArray();
            }
        }
    }
}
