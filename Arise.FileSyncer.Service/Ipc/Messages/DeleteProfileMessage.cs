using System;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class DeleteProfileMessage : IpcMessage
    {
        public override string Command => "deleteProfile";

        public Guid ProfileId { get; set; }

        internal override void Process(IpcController ipc)
        {
            bool success = ipc.Service.Peer.RemoveProfile(ProfileId);
            ipc.Send(new DeleteProfileResultMessage() { Success = success });
        }
    }
}
