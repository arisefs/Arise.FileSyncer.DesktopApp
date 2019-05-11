import { IpcMessage } from "../ipcMessage";
import { Progress, ProgressWithSpeed } from "../../../renderer/app-data/interfaces";

export const Command = "update";

export interface Message extends IpcMessage {
    IsSyncing: boolean,
    GlobalProgress: Progress,
    Progresses: ConnectionProgress[],
}

export interface ConnectionProgress extends ProgressWithSpeed {
    id: string,
}
