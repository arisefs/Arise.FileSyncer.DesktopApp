namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class EditProfileMessageResult : IpcMessage
    {
        public override string Command => "editProfileResult";

        public bool Success { get; set; }
    }
}
