using System;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class SendProfileMessage : IpcMessage
    {
        public override string Command => "sendProfile";

        public Guid ConnectionId { get; set; }
        public Guid ProfileId { get; set; }

        internal override void Process(IpcController ipc)
        {
            ipc.Service.Peer.ShareProfile(ConnectionId, ProfileId);
        }
    }
}
