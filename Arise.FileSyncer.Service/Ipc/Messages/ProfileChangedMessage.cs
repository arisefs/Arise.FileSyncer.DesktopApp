using Arise.FileSyncer.Core;
using Arise.FileSyncer.Service.Ipc.DataModels;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ProfileChangedMessage : IpcMessage
    {
        public override string Command => "profileChanged";

        public ProfileData Profile { get; set; }

        internal IpcMessage Fill(ProfileEventArgs e)
        {
            Profile = new ProfileData(e.Id, e.Profile);

            return this;
        }
    }
}
