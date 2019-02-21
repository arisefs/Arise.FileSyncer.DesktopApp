using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class SetAllowPairingMessage : IpcMessage
    {
        public override string Command => "setAllowPairing";

        public bool AllowPairing { get; set; }

        internal override void Process(IpcController ipc)
        {
            Log.Info("Setting 'AllowPairing' to " + AllowPairing);
            ipc.Service.Peer.AllowPairing = AllowPairing;

            if (AllowPairing)
            {
                ipc.Service.Discovery.SendDiscoveryMessage();
            }
        }
    }
}
