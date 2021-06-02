import { IpcMessage } from "../ipcMessage"

export const Command = "receivedProfile"

export interface Message extends IpcMessage, Data { }

export interface Data {
    ConnectionId: string,
    Id: string,
    Key: string,
    Name: string,
    CreationDate: string,
    SkipHidden: boolean,
}
