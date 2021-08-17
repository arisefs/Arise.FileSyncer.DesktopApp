using System;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ConnectionAddedMessage : IpcMessage
    {
        public override string Command => "connectionAdded";

        public Guid Id { get; set; }

        internal IpcMessage Fill(ConnectionEventArgs e)
        {
            Id = e.Id;
            return this;
        }
    }
}
