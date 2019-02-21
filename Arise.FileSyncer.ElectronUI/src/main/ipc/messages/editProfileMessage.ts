import { IpcMessage } from "../ipcMessage";

export const Command = "editProfile";

export interface Message extends IpcMessage, Data { }

export function Create(data: Data): Message {
    let message: Message = {
        Command: Command,
        Id: data.Id,
        Name: data.Name,
        RootDirectory: data.RootDirectory,
        AllowSend: data.AllowSend,
        AllowReceive: data.AllowReceive,
        AllowDelete: data.AllowDelete,
    };

    return message;
}

export interface Data {
    Id: string,
    Name: string,
    RootDirectory: string,
    AllowSend: boolean,
    AllowReceive: boolean,
    AllowDelete: boolean,
}