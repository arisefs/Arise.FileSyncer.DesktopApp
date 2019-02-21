import React from "react";
import AppData from "../app-data/app-data";
import { ipcRenderer } from "electron";
import { getActivityTypeByName } from "./activity-loader";
import { Initialization } from "../../main/ipc/messages";
import { MainAppActivity } from "./activities/act-main-app";

require("./window-display.css");

interface WindowDisplayState {
    activity: any,
    props: any
}

export class WindowDisplay extends React.Component<any, WindowDisplayState> {
    constructor(props: any) {
        super(props);
        this.state = { activity: null, props: null };

        this.onLoadActivity = this.onLoadActivity.bind(this);
        this.onInitialization = this.onInitialization.bind(this);
    }

    public componentDidMount() {
        ipcRenderer.addListener("window-load-activity", this.onLoadActivity);
        ipcRenderer.addListener("srvInitialization", this.onInitialization);

        ipcRenderer.send("window-ready", null);
    }

    public componentWillUnmount() {
        ipcRenderer.removeListener("window-load-activity", this.onLoadActivity);
        ipcRenderer.removeListener("srvInitialization", this.onInitialization);
    }

    public render() {
        let activity: React.ReactElement<any>;

        if (this.state.activity) {
            activity = React.createElement(this.state.activity, this.state.props);
        }

        return (
            <div id="window-display-box">
                {activity}
            </div>
        );
    }

    public SetActivity(activity: any, props: any) {
        this.setState({
            activity: activity,
            props: props
        });
    }

    private onLoadActivity(_event: any, widgetName: string, props: any) {
        this.SetActivity(getActivityTypeByName(widgetName), props);
    }

    private onInitialization(_event: any, message: Initialization.Message) {
        AppData.reset();

        // Send received data to AppData
        message.Profiles.forEach((v) => {
            AppData.profiles.add(v.Id, {
                name: v.Name,
                activated: v.Activated,
                allowSend: v.AllowSend,
                allowReceive: v.AllowReceive,
                allowDelete: v.AllowDelete,
                creationDate: new Date(v.CreationDate),
                lastSyncDate: new Date(v.LastSyncDate),
                rootDirectory: v.RootDirectory,
                skipHidden: v.SkipHidden,
            });
        });

        message.Connections.forEach((v) => {
            AppData.connections.add(v.Id, {
                verified: v.Verified,
                displayName: v.Name,
                progress: {
                    indeterminate: true,
                    current: 0,
                    maximum: 0,
                }
            });
        });

        this.SetActivity(MainAppActivity, {});
    }
}

