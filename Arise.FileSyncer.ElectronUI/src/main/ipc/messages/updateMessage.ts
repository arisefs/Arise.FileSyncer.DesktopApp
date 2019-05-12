import { IpcMessage } from "../ipcMessage";
import { Progress } from "../../../renderer/app-data/interfaces";

export const Command = "update";

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
