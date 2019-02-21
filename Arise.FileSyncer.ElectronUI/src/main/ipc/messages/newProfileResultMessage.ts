import { IpcMessage } from "../ipcMessage";

export const Command = "newProfileResult";

export interface Message extends IpcMessage {
    Success: boolean,
}