import { IpcMessage } from "../ipcMessage";

export const Command = "setAllowPairing";

export interface Message extends IpcMessage {
    AllowPairing: boolean,
}

export function Create(allow: boolean): Message {
    let message: Message = {
        Command: Command,
        AllowPairing: allow,
    };

    return message;
}
