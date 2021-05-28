namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class WelcomeMessage : IpcMessage
    {
        public override string Command => "welcome";

        internal override void Process(IpcController ipc)
        {
            ipc.Send(new InitializationMessage().Fill(ipc));
        }
    }
}
