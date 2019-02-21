import { IpcMessage } from "../ipcMessage";

export const Command = "connectionVerified";

export interface Message extends IpcMessage {
    Id: string,
    Name: string,
}