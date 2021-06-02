export interface ProfileData {
    Id: string;
    Name: string;
    Activated: boolean;
    AllowSend: boolean;
    AllowReceive: boolean;
    AllowDelete: boolean;
    CreationDate: string;
    LastSyncDate: string;
    RootDirectory: string;
    SkipHidden: boolean;
}
