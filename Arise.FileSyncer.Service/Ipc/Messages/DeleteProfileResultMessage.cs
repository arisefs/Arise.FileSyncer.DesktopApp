namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class DeleteProfileResultMessage : IpcMessage
    {
        public override string Command => "deleteProfileResult";

        public bool Success { get; set; }
    }
}
