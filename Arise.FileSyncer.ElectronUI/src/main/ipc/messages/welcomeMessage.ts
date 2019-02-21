import { IpcMessage } from "../ipcMessage";

export const Command = "welcome";

export interface Message extends IpcMessage { }

export function Create(): Message {
    let message: Message = {
        Command: Command,
    };

    return message;
}
