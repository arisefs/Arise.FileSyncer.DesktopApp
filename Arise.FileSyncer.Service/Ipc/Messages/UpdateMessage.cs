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
        public List<ConnectionProgress> Progresses { get; set; }

        internal IpcMessage Fill(IpcController ipc, ProgressUpdateEventArgs e)
        {
            IsSyncing = ipc.Service.Peer.IsSyncing();
            Progresses = new List<ConnectionProgress>();

            foreach (var p in e.Progresses)
            {
                Progresses.Add(new ConnectionProgress(p.Key, p.Value.Progress, p.Value.Speed));
            }

            return this;
        }

        public struct ConnectionProgress
        {
            public Guid id;
            public bool indeterminate;
            public long current;
            public long maximum;
            public double speed;

            public ConnectionProgress(Guid id, ISyncProgress progress, double speed)
            {
                this.id = id;
                indeterminate = progress.Indeterminate;
                current = progress.Current;
                maximum = progress.Maximum;
                this.speed = speed;
            }
        }
    }
}
