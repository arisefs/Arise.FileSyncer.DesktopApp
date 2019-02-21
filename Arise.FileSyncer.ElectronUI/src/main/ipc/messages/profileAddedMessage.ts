import { IpcMessage } from "../ipcMessage";
import { ProfileData } from "../dataModels/profileData";

export const Command = "profileAdded";

export interface Message extends IpcMessage {
    Profile: ProfileData,
}