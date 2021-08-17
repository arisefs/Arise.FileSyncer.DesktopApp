import { IpcMessage } from "../ipcMessage"

export const Command = "newProfile"

export interface Message extends IpcMessage, Data { }

export function Create(profileData: Data): Message {
    const message: Message = {
        Command: Command,
        DisplayName: profileData.DisplayName,
        RootDirectory: profileData.RootDirectory,
        AllowSend: profileData.AllowSend,
        AllowReceive: profileData.AllowReceive,
        AllowDelete: profileData.AllowDelete,
        SkipHidden: profileData.SkipHidden
    }

    return message
}

export interface Data {
    DisplayName: string,
    RootDirectory: string,
    AllowSend: boolean,
    AllowReceive: boolean,
    AllowDelete: boolean,
    SkipHidden: boolean,
}
