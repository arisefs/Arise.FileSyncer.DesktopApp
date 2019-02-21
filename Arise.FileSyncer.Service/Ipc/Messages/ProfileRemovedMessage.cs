using Arise.FileSyncer.Core;
using Arise.FileSyncer.Service.Ipc.DataModels;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ProfileRemovedMessage : IpcMessage
    {
        public override string Command => "profileRemoved";

        public ProfileData Profile { get; set; }

        internal IpcMessage Fill(ProfileEventArgs e)
        {
            Profile = new ProfileData(e.Id, e.Profile);

            return this;
        }
    }
}
