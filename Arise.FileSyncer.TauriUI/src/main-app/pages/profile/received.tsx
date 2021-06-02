import React from "react"
import AppData from "../../../app-data/app-data"
import { invoke } from "@tauri-apps/api/tauri"
import { PageTitleBar } from "../../../components/page-title-bar"
import { Button } from "../../../components/button"
import { ReceivedProfile, ReceivedProfileResult } from "../../../ipc/messages"
import { goBack } from "../../page-controller"
import { pushNotification } from "../../notification-manager"
import { ProfileEditor, handleTextBoxChange, handleCheckBoxChange, handleDirectorySelected, checkEditorState } from "../../../components/editor"

interface ReceivedProfilePageState {
    waiting: boolean,
    name: string,
    rootDir: string,
    allowSend: boolean,
    allowReceive: boolean,
    allowDelete: boolean,
}

export class ReceivedProfilePage extends React.Component<ReceivedProfile.Data, ReceivedProfilePageState> {
    private handleTextBoxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    private handleCheckBoxChange: (name: string) => void;
    private handleDirectorySelected: (path: string) => void;

    private connectionName = "Unknown";
    private waiting = false;

    constructor(props: ReceivedProfile.Data) {
        super(props)
        this.state = {
            waiting: false,
            name: this.props.Name,
            rootDir: "",
            allowSend: false,
            allowReceive: false,
            allowDelete: false
        }

        if (AppData.connections.containsKey(this.props.ConnectionId)) {
            const connection = AppData.connections.get(this.props.ConnectionId)
            if (connection != null) {
                this.connectionName = connection.displayName
            }
        }

        this.handleTextBoxChange = handleTextBoxChange.bind(this)
        this.handleCheckBoxChange = handleCheckBoxChange.bind(this)
        this.handleDirectorySelected = handleDirectorySelected.bind(this)

        this.onDecline = this.onDecline.bind(this)
        this.onAccept = this.onAccept.bind(this)
    }

    public render() {
        return (
            <div className="base-page">
                <PageTitleBar useMini={false} title={"Received profile from: " + this.connectionName}>
                    <Button style="red" className="page-title-bar-button" onClick={this.onDecline} disabled={this.state.waiting}>Decline</Button>
                    <Button style="blue" className="page-title-bar-button" onClick={this.onAccept} disabled={this.state.waiting}>Accept</Button>
                </PageTitleBar>
                <ProfileEditor disable={this.state.waiting} disableSH={true} name={this.state.name} rootDir={this.state.rootDir}
                    allowSend={this.state.allowSend} allowReceive={this.state.allowReceive} allowDelete={this.state.allowDelete} skipHidden={this.props.SkipHidden}
                    onTextBoxChange={this.handleTextBoxChange} onCheckBoxChange={this.handleCheckBoxChange} onDirectorySelected={this.handleDirectorySelected} />
            </div >
        )
    }

    private onDecline() {
        if (!this.waiting) {
            goBack()
        }
    }

    private onAccept() {
        if (this.waiting) {
            return
        }

        this.waiting = true
        this.setState({ waiting: true })

        if (checkEditorState(this)) {
            const resultData: ReceivedProfileResult.Data = {
                ConnectionId: this.props.ConnectionId,
                Key: this.props.Key,
                Id: this.props.Id,
                Name: this.state.name,
                RootDirectory: this.state.rootDir,
                CreationDate: this.props.CreationDate,
                AllowSend: this.state.allowSend,
                AllowReceive: this.state.allowReceive,
                AllowDelete: this.state.allowDelete,
                SkipHidden: this.props.SkipHidden
            }

            invoke("accept_profile", { resultData })

            pushNotification({
                type: "success",
                text: "Profile \"" + this.props.Name + "\" has been accepted",
                time: 3000
            })

            goBack()
        } else {
            // TODO: better message or no message but show incorrect fields
            pushNotification({
                type: "error",
                text: "Failed to accept profile: Requirements not fulfilled",
                time: 3000
            })

            this.waiting = false
            this.setState({ waiting: false })
        }
    }
}
