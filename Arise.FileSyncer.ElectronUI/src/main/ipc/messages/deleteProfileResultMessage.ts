import { IpcMessage } from "../ipcMessage";

export const Command = "deleteProfileResult";

export interface Message extends IpcMessage {
    Success: boolean,
}