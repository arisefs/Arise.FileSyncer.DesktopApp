import React from "react";
import AppData, { Shared, Interfaces } from "../../../app-data/app-data";
import { Disposable } from "../../../../shared/typed-event";
import { ConnectionItem } from "./connection-item";

interface ConnectionListState {
    cons: ConnectionState[],
}

interface ConnectionState {
    key: string,
    name: string,
    progress: Interfaces.Progress,
}

export class ConnectionList extends React.Component<any, ConnectionListState> {
    private conEvent: Disposable;

    constructor(props: any) {
        super(props);
        this.state = { cons: [] };
    }

    public componentDidMount() {
        this.conEvent = AppData.connections.on(this.onConnectionsChanged.bind(this));
        this.onConnectionsChanged(AppData.connections);
    }

    public componentWillUnmount() {
        this.conEvent.dispose();
    }

    public render() {
        let items = this.state.cons.map((con) => {
            return <ConnectionItem key={con.key} name={con.name} progress={con.progress} />
        });

        return (
            <div>{items}</div>
        );
    }

    private onConnectionsChanged(sd: Shared.Dictionary<Interfaces.Connection>) {
        let keys = sd.keys();
        let values = sd.values();

        if (keys.length != values.length) {
            console.error("This is wrong: keys.length != values.length");
        }

        let newCons: ConnectionState[] = [];

        for (let i = 0; i < keys.length; i++) {
            newCons.push({
                key: keys[i],
                name: values[i].displayName,
                progress: values[i].progress,
            });
        }

        this.setState({ cons: newCons });
    }
}


