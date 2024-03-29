import React from "react"
import AppData, { Shared, Interfaces, Extensions } from "../../../app-data/app-data"
import { invoke } from "@tauri-apps/api/tauri"
import { PageTitleBar } from "../../../components/page-title-bar"
import { Button } from "../../../components/button"
import { DeleteProfileResult } from "../../../ipc/messages"
import { goBack, changePage } from "../../page-controller"
import { ShareProfilePage, ShareProfilePageProps } from "./share"
import { pushNotification } from "../../notification-manager"
import { EditProfilePage, EditProfilePageProps } from "./edit"
import { eventDeleteProfileResult } from "../../../ipc/ipcEvents"
import { Disposable } from "../../../shared/typed-event"

export interface ViewProfilePageProps {
    id: string,
}

interface ViewProfilePageState {
    profile: Interfaces.Profile,
}

export class ViewProfilePage extends React.Component<ViewProfilePageProps, ViewProfilePageState> {
    private profilesEvent?: Disposable
    private resultEvent?: Disposable

    constructor(props: ViewProfilePageProps) {
        super(props)
        this.state = { profile: AppData.profiles.get(this.props.id) }

        this.onEdit = this.onEdit.bind(this)
        this.onShare = this.onShare.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    public async componentDidMount() {
        this.profilesEvent = AppData.profiles.on(this.onProfilesChanged.bind(this))
        this.resultEvent = eventDeleteProfileResult.on(this.onDeleteResult.bind(this))
        this.onProfilesChanged(AppData.profiles)
    }

    public componentWillUnmount() {
        this.profilesEvent?.dispose()
        this.resultEvent?.dispose()
    }

    public render() {
        let title = "Profile: " + this.state.profile.name

        if (!this.state.profile.activated) {
            title += " (Disabled)"
        }

        return (
            <div className="base-page">
                <PageTitleBar useMini={false} title={title}>
                    <Button style="red" className="page-title-bar-button" onClick={this.onDelete}>Delete</Button>
                    <Button style="white" className="page-title-bar-button" onClick={this.onEdit}>Edit</Button>
                    <Button style="blue" className="page-title-bar-button" onClick={this.onShare}>Share</Button>
                </PageTitleBar>
                <div>Type: {Extensions.getProfileTypeString(this.state.profile)}</div>
                <div>Creation Date: {this.state.profile.creationDate.toLocaleString()}</div>
                <div>Last Sync Date: {this.state.profile.lastSyncDate.toLocaleString()}</div>
                <div>Root Directory: {this.state.profile.rootDirectory}</div>
                <div>Skip Hidden: {this.state.profile.skipHidden.toString()}</div>
            </div>
        )
    }

    private onProfilesChanged(sd: Shared.Dictionary<Interfaces.Profile>) {
        const profile = sd.get(this.props.id)

        if (profile != null) {
            this.setState({ profile: profile })
        }
    }

    private onEdit() {
        const props: EditProfilePageProps = { id: this.props.id }

        changePage({ page: EditProfilePage, props: props })
    }

    private onShare() {
        const props: ShareProfilePageProps = {
            profileId: this.props.id,
            profileName: this.state.profile.name
        }

        changePage({ page: ShareProfilePage, props: props })
    }

    private onDelete() {
        const profileId = this.props.id
        invoke("delete_profile", { profileId })
    }

    private onDeleteResult(message: DeleteProfileResult.Message) {
        if (message.Success) {
            pushNotification({
                type: "success",
                text: "Profile \"" + this.state.profile.name + "\" has been successfully deleted",
                time: 3000
            })

            goBack()
        } else {
            pushNotification({
                type: "error",
                text: "Failed to delete profile: Unknown error",
                time: 5000
            })
        }
    }
}
