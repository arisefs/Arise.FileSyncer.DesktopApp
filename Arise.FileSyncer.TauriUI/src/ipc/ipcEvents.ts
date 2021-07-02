import { TypedEvent } from "../shared/typed-event"
import { listen, Event } from "@tauri-apps/api/event"
import { EditProfileResult, NewProfileResult, DeleteProfileResult, Initialization } from "./messages"

export const eventLoadActivity = new TypedEvent<any>()
export const eventInitialization = new TypedEvent<Initialization.Message>()
export const eventEditProfileResult = new TypedEvent<EditProfileResult.Message>()
export const eventNewProfileResult = new TypedEvent<NewProfileResult.Message>()
export const eventDeleteProfileResult = new TypedEvent<DeleteProfileResult.Message>()

export default async function initIpcEvents() {
    await listen("window-load-activity", (e: any) => { emit(e, eventLoadActivity) })
    await listen("srvInitialization", (e: any) => { emit(e, eventInitialization) })
    await listen("srvEditProfileResult", (e: any) => { emit(e, eventEditProfileResult) })
    await listen("srvNewProfileResult", (e: any) => { emit(e, eventNewProfileResult) })
    await listen("srvDeleteProfileResult", (e: any) => { emit(e, eventDeleteProfileResult) })
}

function emit<T>(inEv: Event<T>, outEv: TypedEvent<T>) {
    outEv.emit(inEv.payload)
}