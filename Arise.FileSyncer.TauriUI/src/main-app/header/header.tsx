import React from "react"
import AppData from "../../app-data/app-data"
import SharedDictionary from "../../shared/shared-dictionary"
import { HeaderButton } from "./header-button"
import { Disposable } from "../../shared/typed-event"
import { Connection, Progress } from "../../app-data/interfaces"
import { Sidebar } from "./sidebar/sidebar"
import { SettingsPage } from "../pages/settings"
import { goBack, changePage } from "../page-controller"
import { ProgressBar } from "../../components/progressbar"
import { getPercent, getRemaining, getSpeed, formatSizeNumber, formatTimeNumber } from "../../app-data/extensions"

import "./header.css"

import svgArrowBack from "/resources/icons/sharp-arrow_back-24px.svg"
import svgSettings from "/resources/icons/sharp-settings-24px.svg"
import svgChevronRight from "/resources/icons/sharp-chevron_right-24px.svg"
import svgSync from "/resources/icons/sharp-sync-24px.svg"

interface HeaderProps {
    displayName: string,
    showBackButton: boolean,
}

interface HeaderState {
    connectionCount: number,
    sidebar: SidebarData,
    progress: ProgressBarState,
}

interface ProgressBarState {
    show: boolean,
    percent?: number,
    remaining: number,
    speed?: number,
}

export class Header extends React.Component<HeaderProps, HeaderState> {
    private connectionsEvent?: Disposable = undefined;

    constructor(props: any) {
        super(props)

        this.state = {
            connectionCount: 0,
            sidebar: sidebarClosed,
            progress: {
                show: false,
                percent: undefined,
                remaining: 0,
                speed: undefined
            }
        }

        this.onBackClicked = this.onBackClicked.bind(this)
        this.onSyncingClicked = this.onSyncingClicked.bind(this)
        this.onSettingsClicked = this.onSettingsClicked.bind(this)
        this.updateConnectionData = this.updateConnectionData.bind(this)
        this.closeSidebar = this.closeSidebar.bind(this)
    }

    public componentDidMount() {
        this.connectionsEvent = AppData.connections.on(this.updateConnectionData)
        this.updateConnectionData(AppData.connections)
    }

    public componentWillUnmount() {
        this.connectionsEvent?.dispose()
    }

    public render() {
        let pbLeftLabel = "- KB/s | "
        let pbRightLabel = "- seconds remaining"

        if (this.state.progress.speed !== undefined) {
            pbLeftLabel = formatSizeNumber(this.state.progress.speed) + "/s | "
            if (this.state.progress.speed !== 0) {
                const remainingTime = this.state.progress.remaining / this.state.progress.speed
                pbRightLabel = formatTimeNumber(remainingTime) + " remaining"
            } else {
                pbRightLabel = "- seconds remaining"
            }
        }

        pbLeftLabel += formatSizeNumber(this.state.progress.remaining) + " left"

        return (
            <div className="main-header">
                <HeaderButton
                    extraClasses={this.showBack() ? "main-header-back" : "main-header-back main-header-back-hide"}
                    svgPath={svgArrowBack}
                    onClick={this.onBackClicked} />
                <div className="main-header-left">
                    <div className="main-header-display-name">
                        {this.props.displayName}
                    </div>
                    <div className="main-header-connection-count">
                        {this.state.connectionCount + " Connection"}
                    </div>
                </div>
                <div className="main-header-middle">
                    {this.state.progress.show &&
                        <ProgressBar progress={this.state.progress.percent} leftLabel={pbLeftLabel} rightLabel={pbRightLabel} />
                    }
                </div>
                <HeaderButton
                    extraClasses="main-header-syncing"
                    svgPath={this.state.sidebar.buttonIcon}
                    onClick={this.onSyncingClicked} />
                <HeaderButton
                    extraClasses="main-header-settings"
                    svgPath={svgSettings}
                    onClick={this.onSettingsClicked} />
                <div className={this.state.sidebar.blockerClass} onClick={this.closeSidebar} />
                <div className={this.state.sidebar.sidebarClass}>
                    <Sidebar />
                </div>
            </div>
        )
    }

    private updateConnectionData(sd: SharedDictionary<Connection>) {
        this.setState({ connectionCount: sd.count() })

        const keys = sd.keys()
        const values = sd.values()
        const progress: Progress = {
            indeterminate: true,
            current: 0,
            maximum: 0,
            speed: 0
        }

        for (let i = 0; i < keys.length; i++) {
            const conProgress = values[i].progress
            if (conProgress && !conProgress.indeterminate) {
                progress.indeterminate = false
                progress.current += conProgress.current
                progress.maximum += conProgress.maximum
                progress.speed += conProgress.speed
            }
        }

        this.progressUpdate(progress)
    }

    private progressUpdate(currentProgress: Progress) {
        const progress: ProgressBarState = {
            show: false,
            percent: undefined,
            remaining: 0,
            speed: undefined
        }

        if (!currentProgress.indeterminate) {
            progress.percent = getPercent(currentProgress)
            progress.remaining = getRemaining(currentProgress)
            progress.speed = getSpeed(currentProgress)

            if (progress.percent !== 1) {
                progress.show = true
            }
        }

        this.setState({ progress: progress })
    }

    private onBackClicked() {
        if (!(this.props.showBackButton || this.state.sidebar.isOpen)) {
            return
        }

        if (this.state.sidebar.isOpen) {
            this.closeSidebar()
        } else {
            goBack()
        }
    }

    private onSyncingClicked() {
        if (this.state.sidebar.isOpen) {
            this.closeSidebar()
        } else {
            this.openSidebar()
        }
    }

    private onSettingsClicked() {
        changePage({ page: SettingsPage, props: {} })
    }

    private showBack() {
        return (this.props.showBackButton || this.state.sidebar.isOpen)
    }

    private openSidebar() {
        this.setState({ sidebar: sidebarOpen })
    }

    private closeSidebar() {
        this.setState({ sidebar: sidebarClosed })
    }
}

interface SidebarData {
    isOpen: boolean,
    sidebarClass: string,
    blockerClass: string,
    buttonIcon: string,
}

const sidebarOpen: SidebarData = {
    isOpen: true,
    sidebarClass: "main-header-sidebar main-header-sidebar-show",
    blockerClass: "main-header-sidebar-blocker main-header-sidebar-blocker-show",
    buttonIcon: svgChevronRight
}

const sidebarClosed: SidebarData = {
    isOpen: false,
    sidebarClass: "main-header-sidebar",
    blockerClass: "main-header-sidebar-blocker",
    buttonIcon: svgSync
}
