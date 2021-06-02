import React from "react"
import AppData from "../app-data/app-data"
import { getActivityTypeByName } from "./activity-loader"
import { Initialization } from "../ipc/messages"
import { MainAppActivity } from "./activities/act-main-app"
import { invoke } from "@tauri-apps/api/tauri"
import { listen, UnlistenFn, Event } from "@tauri-apps/api/event"
import { ProfileListPage } from "../main-app/pages/profile/list"

import "./window-display.css"

interface WindowDisplayState {
    activity: any,
    props: any,
    events: UnlistenFn[]
}

export default class WindowDisplay extends React.Component<any, WindowDisplayState> {
    constructor(props: any) {
        super(props)
        this.state = { activity: null, props: null, events: [] }

        this.onLoadActivity = this.onLoadActivity.bind(this)
        this.onInitialization = this.onInitialization.bind(this)
    }

    public async componentDidMount() {
        const evLoad = await listen("window-load-activity", this.onLoadActivity)
        const evInit = await listen("srvInitialization", this.onInitialization)

        this.setState((prevState) => ({ events: [...prevState.events, evLoad, evInit] }))

        invoke("window_ready")
        console.log("WindowDisplay is ready")
    }

    public componentWillUnmount() {
        //this.state.events.forEach((unlisten) => {
        //    unlisten()
        //})

        this.setState({ events: [] })
    }

    public render() {
        return (
            <div id="window-display-box">
                {this.state.activity != null && React.createElement(this.state.activity, this.state.props)}
            </div>
        )
    }

    public SetActivity(activity: any, props: any) {
        this.setState({
            activity: activity,
            props: props
        })
    }

    // TODO: Update to proper type
    private onLoadActivity(e: Event<any>) {
        this.SetActivity(getActivityTypeByName(e.payload.widgetName), e.payload.props)
    }

    private onInitialization(e: Event<Initialization.Message>) {
        const message = e.payload
        AppData.reset()

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
                skipHidden: v.SkipHidden
            })
        })

        message.Connections.forEach((v) => {
            AppData.connections.add(v.Id, {
                verified: v.Verified,
                displayName: v.Name,
                progress: {
                    indeterminate: true,
                    current: 0,
                    maximum: 0,
                    speed: 0
                }
            })
        })

        AppData.pageStack.push({ page: ProfileListPage, props: {} })
        this.SetActivity(MainAppActivity, {})
    }
}

