import AppData from "./app-data"
import { listen, Event } from "@tauri-apps/api/event"
import { changePage } from "../main-app/page-controller"
import { ReceivedProfilePage } from "../main-app/pages/profile/received"
import {
    ConnectionAdded,
    ConnectionVerified,
    ConnectionRemoved,
    Update,
    ProfileAdded,
    ProfileChanged,
    ProfileRemoved,
    ReceivedProfile
} from "../ipc/messages"

export default async function initUpdater() {
    console.log("Initializing IPC listeners")

    await listen("srvConnectionAdded", onConnectionAdded)
    await listen("srvConnectionVerified", onConnectionVerified)
    await listen("srvConnectionRemoved", onConnectionRemoved)
    await listen("srvUpdate", onUpdate)
    await listen("srvProfileAdded", onProfileAdded)
    await listen("srvProfileChanged", onProfileChanged)
    await listen("srvProfileRemoved", onProfileRemoved)
    await listen("srvReceivedProfile", onReceivedProfile)
}

function onConnectionAdded(e: Event<ConnectionAdded.Message>) {
    const message = e.payload

    AppData.connections.add(message.Id, {
        verified: false,
        displayName: "Unknown",
        progress: {
            indeterminate: true,
            current: 0,
            maximum: 0,
            speed: 0
        }
    })
}

function onConnectionVerified(e: Event<ConnectionVerified.Message>) {
    const message = e.payload

    if (AppData.connections.containsKey(message.Id)) {
        const connection = AppData.connections.get(message.Id)
        connection.verified = true
        connection.displayName = message.Name
        AppData.connections.set(message.Id, connection)
    } else {
        console.log("Verified connection does not exist! This should not happen!")
    }
}

function onConnectionRemoved(e: Event<ConnectionRemoved.Message>) {
    if (AppData.connections.remove(e.payload.Id) === null) {
        console.log("Connection does not exist! This should not happen!")
    }
}

function onUpdate(e: Event<Update.Message>) {
    for (const progress of e.payload.Progresses) {
        if (AppData.connections.containsKey(progress.Id)) {
            const connection = AppData.connections.get(progress.Id)
            connection.progress = {
                indeterminate: progress.Indeterminate,
                current: progress.Current,
                maximum: progress.Maximum,
                speed: progress.Speed
            }
            AppData.connections.set(progress.Id, connection)
        }
    }
}

function onProfileAdded(e: Event<ProfileAdded.Message>) {
    const op = e.payload.Profile

    AppData.profiles.add(op.Id, {
        name: op.Name,
        activated: op.Activated,
        allowSend: op.AllowSend,
        allowReceive: op.AllowReceive,
        allowDelete: op.AllowDelete,
        creationDate: new Date(op.CreationDate),
        lastSyncDate: new Date(op.LastSyncDate),
        rootDirectory: op.RootDirectory,
        skipHidden: op.SkipHidden
    })
}

function onProfileChanged(e: Event<ProfileChanged.Message>) {
    const op = e.payload.Profile

    AppData.profiles.set(op.Id, {
        name: op.Name,
        activated: op.Activated,
        allowSend: op.AllowSend,
        allowReceive: op.AllowReceive,
        allowDelete: op.AllowDelete,
        creationDate: new Date(op.CreationDate),
        lastSyncDate: new Date(op.LastSyncDate),
        rootDirectory: op.RootDirectory,
        skipHidden: op.SkipHidden
    })
}

function onProfileRemoved(e: Event<ProfileRemoved.Message>) {
    AppData.profiles.remove(e.payload.Profile.Id)
}

function onReceivedProfile(e: Event<ReceivedProfile.Message>) {
    changePage({ page: ReceivedProfilePage, props: e.payload })
}
