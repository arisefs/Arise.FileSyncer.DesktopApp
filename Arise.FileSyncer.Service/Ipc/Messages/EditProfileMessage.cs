using System;
using Arise.FileSyncer.Core;
using Arise.FileSyncer.Core.Helpers;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class EditProfileMessage : IpcMessage
    {
        public override string Command => "editProfile";

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string RootDirectory { get; set; }
        public bool AllowSend { get; set; }
        public bool AllowReceive { get; set; }
        public bool AllowDelete { get; set; }

        internal override void Process(IpcController ipc)
        {
            bool success = false;

            if (ipc.Service.Peer.Profiles.GetProfile(Id, out var oldProfile))
            {
                SyncProfile newProfile = new(oldProfile)
                {
                    Name = Name,
                    RootDirectory = PathHelper.GetCorrect(RootDirectory, true),
                    AllowSend = AllowSend,
                    AllowReceive = AllowReceive,
                    AllowDelete = AllowDelete,
                };

                success = ipc.Service.Peer.Profiles.UpdateProfile(Id, newProfile);
            }
            else
            {
                Log.Warning($"{this}: Failed to get profile!");
            }

            ipc.Send(new EditProfileMessageResult() { Success = success });
        }
    }
}
