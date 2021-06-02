import { IpcMessage } from "../ipcMessage"
import { ProfileData } from "../dataModels/profileData"

export const Command = "initialization"

export interface Message extends IpcMessage {
    DisplayName: string,
    Profiles: ProfileData[],
    Connections: ConnectionData[],
}

export interface ConnectionData {
    Id: string,
    Verified: boolean,
    Name: string,
}
