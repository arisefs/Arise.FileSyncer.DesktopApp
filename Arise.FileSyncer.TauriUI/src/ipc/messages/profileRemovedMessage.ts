import { IpcMessage } from "../ipcMessage"
import { ProfileData } from "../dataModels/profileData"

export const Command = "profileRemoved"

export interface Message extends IpcMessage {
    Profile: ProfileData,
}
