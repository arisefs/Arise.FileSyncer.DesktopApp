using System;
using Arise.FileSyncer.Core;

namespace Arise.FileSyncer.Service.Ipc.DataModels
{
    public class ProfileData
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool Activated { get; set; }
        public bool AllowSend { get; set; }
        public bool AllowReceive { get; set; }
        public bool AllowDelete { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastSyncDate { get; set; }
        public string RootDirectory { get; set; }
        public bool SkipHidden { get; set; }

        public ProfileData() { }

        public ProfileData(Guid profileId, SyncProfile syncProfile)
        {
            Id = profileId;
            Name = syncProfile.Name;
            Activated = syncProfile.Activated;
            AllowSend = syncProfile.AllowSend;
            AllowReceive = syncProfile.AllowReceive;
            AllowDelete = syncProfile.AllowDelete;
            CreationDate = syncProfile.CreationDate;
            LastSyncDate = syncProfile.LastSyncDate;
            RootDirectory = syncProfile.RootDirectory;
            SkipHidden = syncProfile.SkipHidden;
        }
    }
}
