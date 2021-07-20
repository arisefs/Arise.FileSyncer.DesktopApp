using System;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ConnectionRemovedMessage : IpcMessage
    {
        public override string Command => "connectionRemoved";

        public Guid Id { get; set; }

        internal IpcMessage Fill(ConnectionEventArgs e)
        {
            Id = e.Id;
            return this;
        }
    }
}
