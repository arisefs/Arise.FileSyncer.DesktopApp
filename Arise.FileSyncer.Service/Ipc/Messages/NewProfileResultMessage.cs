namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class NewProfileResultMessage : IpcMessage
    {
        public override string Command => "newProfileResult";

        public bool Success { get; set; }
    }
}
