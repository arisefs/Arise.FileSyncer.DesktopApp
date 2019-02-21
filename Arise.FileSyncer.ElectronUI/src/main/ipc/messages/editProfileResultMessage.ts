import { IpcMessage } from "../ipcMessage";

export const Command = "editProfileResult";

export interface Message extends IpcMessage {
    Success: boolean,
}