import React from "react"
import AppData, { Shared, Interfaces } from "../../../app-data/app-data"
import { invoke } from "@tauri-apps/api/tauri"
import { PageTitleBar } from "../../../components/page-title-bar"
import { Disposable } from "../../../shared/typed-event"
import { SendProfile } from "../../../ipc/messages"
import { goBack } from "../../page-controller"
import { pushNotification } from "../../notification-manager"

import "./share.css"

export interface ShareProfilePageProps {
    profileId: string,
    profileName: string,
}

interface ShareProfilePageState {
    connections: Connection[],
}

interface Connection {
    id: string,
    name: string,
}

export class ShareProfilePage extends React.Component<ShareProfilePageProps, ShareProfilePageState> {
    private connectionsEvent?: Disposable;

    constructor(props: ShareProfilePageProps) {
        super(props)
        this.state = { connections: [] }
    }

    public componentDidMount() {
        this.connectionsEvent = AppData.connections.on(this.onConnectionsChanged.bind(this))
        this.onConnectionsChanged(AppData.connections)
    }

    public componentWillUnmount() {
        this.connectionsEvent?.dispose()
    }

    public render() {
        const connections = this.state.connections.map((connection) => {
            return (
                <ConnectionListItem key={connection.id} id={connection.id}
                    name={connection.name} onSelected={this.share.bind(this)} />
            )
        })

        return (
            <div className="base-page">
                <PageTitleBar useMini={false} title={"Share: " + this.props.profileName} />
                <div className="share_profile-list">{connections}</div>
            </div>
        )
    }

    private onConnectionsChanged(sd: Shared.Dictionary<Interfaces.Connection>) {
        const keys = sd.keys()
        const values = sd.values()

        if (keys.length !== values.length) {
            console.error("This is wrong: keys.length != values.length")
        }

        const newConnections: Connection[] = []

        for (let i = 0; i < keys.length; i++) {
            newConnections.push({
                id: keys[i],
                name: values[i].displayName
            })
        }

        this.setState({ connections: newConnections })
    }

    private share(connectionId: string) {
        const shareData: SendProfile.Data = {
            ConnectionId: connectionId,
            ProfileId: this.props.profileId
        }

        invoke("share_profile", { shareData })

        pushNotification({
            type: "success",
            text: "Profile \"" + this.props.profileName + "\" has been sent to the target device",
            time: 3000
        })

        goBack()
    }
}

interface ConnectionListItemProps {
    id: string,
    name: string,
    onSelected: (id: string) => void,
}

class ConnectionListItem extends React.Component<ConnectionListItemProps, any> {
    constructor(props: ConnectionListItemProps) {
        super(props)
    }

    public render() {
        return (
            <div className="profile-share-connection-item" onClick={this.onClicked.bind(this)}>
                {this.props.name}
            </div>
        )
    }

    private onClicked() {
        this.props.onSelected(this.props.id)
    }
}
