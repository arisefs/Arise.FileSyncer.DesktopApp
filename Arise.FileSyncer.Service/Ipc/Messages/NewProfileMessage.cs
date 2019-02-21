using System;
using Arise.FileSyncer.Core;
using Arise.FileSyncer.Core.Helpers;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class NewProfileMessage : IpcMessage
    {
        public override string Command => "newProfile";

        public string DisplayName { get; set; }
        public string RootDirectory { get; set; }
        public bool AllowSend { get; set; }
        public bool AllowReceive { get; set; }
        public bool AllowDelete { get; set; }
        public bool SkipHidden { get; set; }

        internal override void Process(IpcController ipc)
        {
            SyncProfile profile = new SyncProfile.Creator()
            {
                Key = Guid.NewGuid(),
                Name = DisplayName,
                RootDirectory = PathHelper.GetCorrect(RootDirectory, true),
                AllowSend = AllowSend,
                AllowReceive = AllowReceive,
                AllowDelete = AllowDelete,
                SkipHidden = SkipHidden
            };

            bool success = ipc.Service.Peer.AddProfile(Guid.NewGuid(), profile);
            ipc.Send(new NewProfileResultMessage() { Success = success });
        }
    }
}
