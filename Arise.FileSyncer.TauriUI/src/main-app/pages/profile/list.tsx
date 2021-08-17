import React from "react"
import AppData, { Shared, Interfaces, Extensions } from "../../../app-data/app-data"
import { PageTitleBar } from "../../../components/page-title-bar"
import { Disposable } from "../../../shared/typed-event"
import { changePage } from "../../page-controller"
import { ViewProfilePage, ViewProfilePageProps } from "./view"
import { NewProfilePage } from "./new"

import "./list.css"

interface ProfileListPageState {
    profiles: ProfileData[],
}

interface ProfileData extends Interfaces.Profile {
    id: string,
}

export class ProfileListPage extends React.Component<any, ProfileListPageState> {
    private profilesEvent?: Disposable

    constructor(props: any) {
        super(props)
        this.state = { profiles: [] }
    }

    public componentDidMount() {
        this.profilesEvent = AppData.profiles.on(this.onProfilesChanged.bind(this))
        this.onProfilesChanged(AppData.profiles)
    }

    public componentWillUnmount() {
        this.profilesEvent?.dispose()
    }

    public render() {
        const profiles = this.state.profiles.map((profile) => {
            return (
                <ProfileListButton key={profile.id} profile={profile} />
            )
        })

        return (
            <div className="base-page">
                <PageTitleBar useMini={false} title="Profiles" />
                <div className="profiles-page-grid">
                    {profiles}
                    <div className="profiles-page-item profiles-page-icon-item" onClick={this.onNewProfile.bind(this)}>
                        <svg className="profiles-page-new-icon" height="32" width="32">
                            <path d="M12 0 h4 v12 h12 v4 h-12 v12 h-4 v-12 h-12 v-4 h12 z" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }

    private onNewProfile() {
        changePage({ page: NewProfilePage, props: {} })
    }

    private onProfilesChanged(sd: Shared.Dictionary<Interfaces.Profile>) {
        const keys = sd.keys()
        const values = sd.values()

        if (keys.length !== values.length) {
            console.error("This is wrong: keys.length != values.length")
        }

        const profiles: ProfileData[] = []

        for (let i = 0; i < keys.length; i++) {
            profiles.push({
                id: keys[i],
                ...values[i]
            })
        }

        this.setState({ profiles: profiles })
    }
}

interface ProfileListButtonProps {
    profile: ProfileData,
}

export class ProfileListButton extends React.Component<ProfileListButtonProps, any> {
    constructor(props: ProfileListButtonProps) {
        super(props)
    }

    public render() {
        return (
            <div className="profiles-page-item" onClick={this.onClicked.bind(this)}>
                <div className="ppi-name">{this.props.profile.name}</div>
                <div className="ppi-item">Type: {Extensions.getProfileTypeString(this.props.profile)}</div>
                <div className="ppi-item">Location: {this.props.profile.rootDirectory}</div>
                <div className="ppi-item">Last Sync: {this.props.profile.lastSyncDate.toLocaleString()}</div>
            </div>
        )
    }

    private onClicked() {
        const props: ViewProfilePageProps = { id: this.props.profile.id }

        changePage({ page: ViewProfilePage, props: props })
    }
}
