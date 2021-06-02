import { IpcMessage } from "../ipcMessage"

export const Command = "receivedProfileResult"

export interface Message extends IpcMessage, Data { }

export function Create(data: Data): Message {
    const message: Message = {
        Command: Command,
        ConnectionId: data.ConnectionId,
        Key: data.Key,
        Id: data.Id,
        Name: data.Name,
        RootDirectory: data.RootDirectory,
        CreationDate: data.CreationDate,
        AllowSend: data.AllowSend,
        AllowReceive: data.AllowReceive,
        AllowDelete: data.AllowDelete,
        SkipHidden: data.SkipHidden
    }

    return message
}

export interface Data {
    ConnectionId: string,
    Key: string,
    Id: string,
    Name: string,
    RootDirectory: string,
    CreationDate: string,
    AllowSend: boolean,
    AllowReceive: boolean,
    AllowDelete: boolean,
    SkipHidden: boolean,
}
