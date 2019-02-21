using System;
using Arise.FileSyncer.Core;
using Arise.FileSyncer.Core.Helpers;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ReceivedProfileResultMessage : IpcMessage
    {
        public override string Command => "receivedProfileResult";

        public Guid ConnectionId { get; set; }
        public Guid Key { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string RootDirectory { get; set; }
        public DateTime CreationDate { get; set; }
        public bool AllowSend { get; set; }
        public bool AllowReceive { get; set; }
        public bool AllowDelete { get; set; }
        public bool SkipHidden { get; set; }

        internal override void Process(IpcController ipc)
        {
            SyncProfile profile = new SyncProfile.Creator()
            {
                Key = Key,
                Name = Name,
                RootDirectory = PathHelper.GetCorrect(RootDirectory, true),
                CreationDate = CreationDate,
                LastSyncDate = CreationDate,
                Activated = true,
                AllowSend = AllowSend,
                AllowReceive = AllowReceive,
                AllowDelete = AllowDelete,
                SkipHidden = SkipHidden
            };

            if (ipc.Service.Peer.AddProfile(Id, profile))
            {
                if (!ipc.Service.Peer.SyncProfile(ConnectionId, Id))
                {
                    Log.Warning("Failed to start syncing the profile");
                }
            }
            else Log.Warning("Failed to add profile");
        }
    }
}
