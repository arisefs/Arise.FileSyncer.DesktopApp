import AppData from "./app-data";
import { ipcRenderer } from "electron";
import { changePage } from "../main-app/page-controller";
import { ReceivedProfilePage } from "../main-app/pages/profile/received";
import {
    ConnectionAdded,
    ConnectionVerified,
    ConnectionRemoved,
    Update,
    ProfileAdded,
    ProfileChanged,
    ProfileRemoved,
    ReceivedProfile,
} from "../../main/ipc/messages";

export function initUpdater() {
    ipcRenderer.on("srvConnectionAdded", onConnectionAdded);
    ipcRenderer.on("srvConnectionVerified", onConnectionVerified);
    ipcRenderer.on("srvConnectionRemoved", onConnectionRemoved);
    ipcRenderer.on("srvUpdate", onUpdate);
    ipcRenderer.on("srvProfileAdded", onProfileAdded);
    ipcRenderer.on("srvProfileChanged", onProfileChanged);
    ipcRenderer.on("srvProfileRemoved", onProfileRemoved);
    ipcRenderer.on("srvReceivedProfile", onReceivedProfile);
}

function onConnectionAdded(_e: any, message: ConnectionAdded.Message) {
    AppData.connections.add(message.Id, {
        verified: false,
        displayName: "Unknown",
        progress: {
            indeterminate: true,
            current: 0,
            maximum: 0,
            speed: 0,
        }
    });
}

function onConnectionVerified(_e: any, message: ConnectionVerified.Message) {
    if (AppData.connections.containsKey(message.Id)) {
        let connection = AppData.connections.get(message.Id);
        connection.verified = true;
        connection.displayName = message.Name;
        AppData.connections.set(message.Id, connection);
    } else {
        console.log("Verified connection does not exist! This should not happen!");
    }
}

function onConnectionRemoved(_e: any, message: ConnectionRemoved.Message) {
    if (AppData.connections.remove(message.Id) === null) {
        console.log("Connection does not exist! This should not happen!");
    }
}

function onUpdate(_e: any, message: Update.Message) {
    AppData.lastGlobalProgress.set(AppData.globalProgress.get());
    AppData.globalProgress.set(message.GlobalProgress);

    for (let progress of message.Progresses) {
        if (AppData.connections.containsKey(progress.id)) {
            let connection = AppData.connections.get(progress.id);
            connection.progress = progress;
            AppData.connections.set(progress.id, connection);
        }
    }
}

function onProfileAdded(_e: any, message: ProfileAdded.Message) {
    let op = message.Profile;

    AppData.profiles.add(op.Id, {
        name: op.Name,
        activated: op.Activated,
        allowSend: op.AllowSend,
        allowReceive: op.AllowReceive,
        allowDelete: op.AllowDelete,
        creationDate: new Date(op.CreationDate),
        lastSyncDate: new Date(op.LastSyncDate),
        rootDirectory: op.RootDirectory,
        skipHidden: op.SkipHidden,
    });
}

function onProfileChanged(_e: any, message: ProfileChanged.Message) {
    let op = message.Profile;

    AppData.profiles.set(op.Id, {
        name: op.Name,
        activated: op.Activated,
        allowSend: op.AllowSend,
        allowReceive: op.AllowReceive,
        allowDelete: op.AllowDelete,
        creationDate: new Date(op.CreationDate),
        lastSyncDate: new Date(op.LastSyncDate),
        rootDirectory: op.RootDirectory,
        skipHidden: op.SkipHidden,
    });
}

function onProfileRemoved(_e: any, message: ProfileRemoved.Message) {
    AppData.profiles.remove(message.Profile.Id);
}

function onReceivedProfile(_e: any, message: ReceivedProfile.Message) {
    changePage({ page: ReceivedProfilePage, props: message });
}
