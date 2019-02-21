using System;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class ReceivedProfileMessage : IpcMessage
    {
        public override string Command => "receivedProfile";

        public Guid ConnectionId { get; set; }
        public string Id { get; set; }
        public Guid Key { get; set; }
        public string Name { get; set; }
        public DateTime CreationDate { get; set; }
        public bool SkipHidden { get; set; }

        internal IpcMessage Fill(ProfileReceivedEventArgs e)
        {
            ConnectionId = e.RemoteId;
            Id = e.Id.ToString();
            Key = e.Key;
            Name = e.Name;
            CreationDate = e.CreationDate;
            SkipHidden = e.SkipHidden;
            return this;
        }
    }
}
