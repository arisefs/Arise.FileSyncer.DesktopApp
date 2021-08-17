import { IpcMessage } from "../ipcMessage"

export const Command = "sendProfile"

export interface Message extends IpcMessage, Data { }

export function Create(data: Data): Message {
    const message: Message = {
        Command: Command,
        ConnectionId: data.ConnectionId,
        ProfileId: data.ProfileId
    }

    return message
}

export interface Data {
    ConnectionId: string,
    ProfileId: string,
}
