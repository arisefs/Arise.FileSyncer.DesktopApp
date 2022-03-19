import { TypedEvent } from "../shared/typed-event"
import { Event } from "@tauri-apps/api/event"
import { appWindow } from "@tauri-apps/api/window"
import { EditProfileResult, NewProfileResult, DeleteProfileResult, Initialization } from "./messages"

export const eventLoadActivity = new TypedEvent<any>()
export const eventInitialization = new TypedEvent<Initialization.Message>()
export const eventEditProfileResult = new TypedEvent<EditProfileResult.Message>()
export const eventNewProfileResult = new TypedEvent<NewProfileResult.Message>()
export const eventDeleteProfileResult = new TypedEvent<DeleteProfileResult.Message>()

export default async function initIpcEvents() {
    await appWindow.listen("window-load-activity", (e: Event<any>) => { emit(e, eventLoadActivity) })
    await appWindow.listen("srvInitialization", (e: Event<any>) => { emit(e, eventInitialization) })
    await appWindow.listen("srvEditProfileResult", (e: Event<any>) => { emit(e, eventEditProfileResult) })
    await appWindow.listen("srvNewProfileResult", (e: Event<any>) => { emit(e, eventNewProfileResult) })
    await appWindow.listen("srvDeleteProfileResult", (e: Event<any>) => { emit(e, eventDeleteProfileResult) })
}

function emit<T>(inEv: Event<T>, outEv: TypedEvent<T>) {
    outEv.emit(inEv.payload)
}