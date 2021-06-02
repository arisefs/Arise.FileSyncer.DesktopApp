import React from "react"
import AppData, { Shared } from "../../app-data/app-data"
import { Header } from "../../main-app/header/header"
import { Disposable } from "../../shared/typed-event"
import { PageStack, Notification } from "../../app-data/interfaces"

import "./act-main-app.css"

interface MainAppActivityState {
    showBackButton: boolean,
    currentPage: React.ReactElement<any> | null,
    notification: Notification,
    showNotification: boolean,
}

export class MainAppActivity extends React.Component<any, MainAppActivityState> {
    private pageStackEvent?: Disposable;
    private notificationEvent?: Disposable;
    private allowNotificationEvent: boolean;

    private notifTimeout: NodeJS.Timer | null = null;
    private notifCooldown: NodeJS.Timer | null = null;

    constructor(props: any) {
        super(props)

        this.state = {
            showBackButton: false,
            currentPage: null,
            notification: { type: "", text: "", time: 0 },
            showNotification: false
        }

        this.allowNotificationEvent = true

        this.pageStackChanged = this.pageStackChanged.bind(this)
        this.notificationReceived = this.notificationReceived.bind(this)
    }

    public componentDidMount() {
        this.pageStackEvent = AppData.pageStack.setup(this.pageStackChanged)
        this.notificationEvent = AppData.notificationStack.setup(this.notificationReceived)
    }

    public componentWillUnmount() {
        this.pageStackEvent?.dispose()
        this.notificationEvent?.dispose()

        if (this.notifTimeout != null) {
            clearTimeout(this.notifTimeout)
        }

        if (this.notifCooldown != null) {
            clearTimeout(this.notifCooldown)
        }
    }

    public render() {
        return (
            <div id="act-main-app">
                <div id="main-act-header">
                    <Header
                        displayName={this.props.DisplayName}
                        showBackButton={this.state.showBackButton} />
                </div>
                <div id="main-act-content">
                    {this.state.currentPage}
                </div>
                {this.renderNotification()}
            </div>
        )
    }

    private renderNotification() {
        let state = "main-act-notification-"

        if (this.state.showNotification) {
            state += "show"
        } else {
            state += "hide"
        }

        state += " main-act-notification-" + this.state.notification.type

        return (
            <div id="main-act-notification" className={state}>
                {this.state.notification.text}
            </div>
        )
    }

    private pageStackChanged(sa: Shared.Array<PageStack>) {
        if (sa.length() > 0) {
            const ps = sa.peek()
            if (ps != null) {
                this.setState({
                    showBackButton: sa.length() > 1,
                    currentPage: React.createElement(ps.page, ps.props)
                })
            }
        }
    }

    private notificationReceived() {
        if (this.allowNotificationEvent) {
            this.loadNextNotification()
        }
    }

    private loadNextNotification() {
        if (AppData.notificationStack.length() > 0) {
            this.allowNotificationEvent = false
            let notification = AppData.notificationStack.shift()
            if (notification === undefined) {
                notification = { type: "", text: "", time: 0 }
            }

            this.setState({
                showNotification: true,
                notification: notification
            })

            this.notifTimeout = setTimeout(() => {
                this.setState({ showNotification: false })

                this.notificationCooldown()
            }, notification.time)
        } else {
            this.allowNotificationEvent = true
        }
    }

    private notificationCooldown() {
        this.notifCooldown = setTimeout(() => {
            this.loadNextNotification()
        }, 500)
    }
}
