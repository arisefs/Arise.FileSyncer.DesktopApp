import { IpcMessage } from "../ipcMessage";

export const Command = "deleteProfile";

export interface Message extends IpcMessage {
    ProfileId: string,
}

export function Create(profileId: string): Message {
    let message: Message = {
        Command: Command,
        ProfileId: profileId,
    };

    return message;
}