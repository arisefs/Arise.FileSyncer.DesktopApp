using System;
using System.Collections.Generic;
using Arise.FileSyncer.Common;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.Messages
{
    public class UpdateMessage : IpcMessage
    {
        public override string Command => "update";

        public bool IsSyncing { get; set; }
        public ICollection<ProgressStatus> Progresses { get; set; }

        internal IpcMessage Fill(IpcController ipc, ProgressUpdateEventArgs e)
        {
            IsSyncing = ipc.Service.Peer.IsSyncing();
            Progresses = e.Progresses;
            return this;
        }
    }
}
