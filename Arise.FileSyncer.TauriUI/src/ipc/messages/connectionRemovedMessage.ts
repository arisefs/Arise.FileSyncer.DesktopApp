import { IpcMessage } from "../ipcMessage"

export const Command = "connectionRemoved"

export interface Message extends IpcMessage {
    Id: string,
}
