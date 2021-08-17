import { IpcMessage } from "../ipcMessage"

export const Command = "update"

export interface Message extends IpcMessage {
    IsSyncing: boolean,
    Progresses: ConnectionProgress[],
}

export interface ConnectionProgress {
    Id: string,
    Indeterminate: boolean,
    Current: number,
    Maximum: number,
    Speed: number,
}
