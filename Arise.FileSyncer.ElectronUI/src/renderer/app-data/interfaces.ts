export interface Profile {
    name: string,
    activated: boolean,
    allowSend: boolean,
    allowReceive: boolean,
    allowDelete: boolean,
    creationDate: Date,
    lastSyncDate: Date,
    rootDirectory: string,
    skipHidden: boolean,
}

export interface Connection {
    verified: boolean,
    displayName: string,
    progress: Progress,
}

export interface Progress {
    indeterminate: boolean,
    current: number,
    maximum: number,
    speed: number,
}

export interface PageStack {
    page: any,
    props: any,
}

export interface Notification {
    type: string,
    text: string,
    time: number,
}
