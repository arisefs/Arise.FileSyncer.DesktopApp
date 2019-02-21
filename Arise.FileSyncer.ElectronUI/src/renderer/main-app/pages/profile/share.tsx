import React from "react";
import AppData, { Shared, Interfaces } from "../../../app-data/app-data";
import { PageTitleBar } from "../../../components/page-title-bar";
import { Disposable } from "../../../../shared/typed-event";
import { ipcRenderer } from "electron";
import { SendProfile } from "../../../../main/ipc/messages";
import { goBack } from "../../page-controller";
import { pushNotification } from "../../notification-manager";

require("./share.css");

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
    private connectionsEvent: Disposable;

    constructor(props: ShareProfilePageProps) {
        super(props);
        this.state = { connections: [] };
    }

    public componentDidMount() {
        this.connectionsEvent = AppData.connections.on(this.onConnectionsChanged.bind(this));
        this.onConnectionsChanged(AppData.connections);
    }

    public componentWillUnmount() {
        this.connectionsEvent.dispose();
    }

    public render() {
        let connections = this.state.connections.map((connection) => {
            return (
                <ConnectionListItem key={connection.id} id={connection.id}
                    name={connection.name} onSelected={this.share.bind(this)} />
            );
        });

        return (
            <div className="base-page">
                <PageTitleBar useMini={false} title={"Share: " + this.props.profileName} />
                <div className="share-profile-list">{connections}</div>
            </div>
        );
    }

    private onConnectionsChanged(sd: Shared.Dictionary<Interfaces.Connection>) {
        let keys = sd.keys();
        let values = sd.values();

        if (keys.length != values.length) {
            console.error("This is wrong: keys.length != values.length");
        }

        let newConnections: Connection[] = [];

        for (let i = 0; i < keys.length; i++) {
            newConnections.push({
                id: keys[i],
                name: values[i].displayName,
            });
        }

        this.setState({ connections: newConnections });
    }

    private share(connectionId: string) {
        let shareData: SendProfile.Data = {
            ConnectionId: connectionId,
            ProfileId: this.props.profileId,
        };

        ipcRenderer.send("share-profile", shareData);

        pushNotification({
            type: "success",
            text: "Profile \"" + this.props.profileName + "\" has been sent to the target device",
            time: 3000,
        });

        goBack();
    }
}

interface ConnectionListItemProps {
    id: string,
    name: string,
    onSelected: (id: string) => void,
}

class ConnectionListItem extends React.Component<ConnectionListItemProps, any> {
    constructor(props: ConnectionListItemProps) {
        super(props);
    }

    public render() {
        return (
            <div className="profile-share-connection-item" onClick={this.onClicked.bind(this)}>
                {this.props.name}
            </div>
        );
    }

    private onClicked(_e: any) {
        this.props.onSelected(this.props.id);
    }
}