import { IpcMessage } from "../ipcMessage"

export const Command = "welcome"

export type Message = IpcMessage

export function Create(): Message {
    const message: Message = { Command: Command }

    return message
}
