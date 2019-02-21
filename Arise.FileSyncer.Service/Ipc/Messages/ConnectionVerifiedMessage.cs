using System;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ConnectionVerifiedMessage : IpcMessage
    {
        public override string Command => "connectionVerified";

        public Guid Id { get; set; }
        public string Name { get; set; }

        internal IpcMessage Fill(ConnectionVerifiedEventArgs e)
        {
            Id = e.Id;
            Name = e.Name;
            return this;
        }
    }
}
