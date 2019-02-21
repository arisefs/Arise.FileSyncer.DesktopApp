import { IpcMessage } from "../ipcMessage";

export const Command = "connectionAdded";

export interface Message extends IpcMessage {
    Id: string,
}