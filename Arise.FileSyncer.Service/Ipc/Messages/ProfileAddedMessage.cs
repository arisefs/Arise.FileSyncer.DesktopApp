using Arise.FileSyncer.Core;
using Arise.FileSyncer.Service.Ipc.DataModels;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ProfileAddedMessage : IpcMessage
    {
        public override string Command => "profileAdded";

        public ProfileData Profile { get; set; }

        internal IpcMessage Fill(ProfileEventArgs e)
        {
            Profile = new ProfileData(e.Id, e.Profile);

            return this;
        }
    }
}
