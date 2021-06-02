import React from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { listen, UnlistenFn, Event } from "@tauri-apps/api/event"
import { PageTitleBar } from "../../../components/page-title-bar"
import { Button } from "../../../components/button"
import { NewProfileResult, NewProfile } from "../../../ipc/messages"
import { goBack } from "../../page-controller"
import { pushNotification } from "../../notification-manager"
import { ProfileEditor, handleTextBoxChange, handleCheckBoxChange, handleDirectorySelected, checkEditorState } from "../../../components/editor"

interface NewProfilePageProps {}

interface NewProfilePageState {
    waiting: boolean,

    name: string,
    rootDir: string,
    allowSend: boolean,
    allowReceive: boolean,
    allowDelete: boolean,
    skipHidden: boolean,

    eventUnlisten?: UnlistenFn
}

export class NewProfilePage extends React.Component<NewProfilePageProps, NewProfilePageState> {
    private handleTextBoxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    private handleCheckBoxChange: (name: string) => void;
    private handleDirectorySelected: (path: string) => void;

    private waiting = false;

    constructor(props: NewProfilePageProps) {
        super(props)
        this.state = {
            waiting: false,
            name: "",
            rootDir: "",
            allowSend: false,
            allowReceive: false,
            allowDelete: false,
            skipHidden: true,
            eventUnlisten: undefined
        }

        this.handleTextBoxChange = handleTextBoxChange.bind(this)
        this.handleCheckBoxChange = handleCheckBoxChange.bind(this)
        this.handleDirectorySelected = handleDirectorySelected.bind(this)

        this.onResult = this.onResult.bind(this)
        this.onCreate = this.onCreate.bind(this)
    }

    public async componentDidMount() {
        this.setState({ eventUnlisten: await listen("srvNewProfileResult", this.onResult) })
    }

    public componentWillUnmount() {
        if (this.state.eventUnlisten !== undefined) {
            //this.state.eventUnlisten()
        }

        this.setState({ eventUnlisten: undefined })
    }

    public render() {
        return (
            <div className="base-page">
                <PageTitleBar useMini={false} title="Create new profile">
                    <Button style="blue" className="page-title-bar-button" onClick={this.onCreate} disabled={this.state.waiting}>Create</Button>
                </PageTitleBar>
                <ProfileEditor disable={this.state.waiting} disableSH={this.state.waiting} name={this.state.name} rootDir={this.state.rootDir}
                    allowSend={this.state.allowSend} allowReceive={this.state.allowReceive} allowDelete={this.state.allowDelete} skipHidden={this.state.skipHidden}
                    onTextBoxChange={this.handleTextBoxChange} onCheckBoxChange={this.handleCheckBoxChange} onDirectorySelected={this.handleDirectorySelected} />
            </div >
        )
    }

    private onCreate() {
        if (this.waiting) {
            return
        }

        this.waiting = true
        this.setState({ waiting: true })

        if (checkEditorState(this)) {
            const profileData: NewProfile.Data = {
                DisplayName: this.state.name,
                RootDirectory: this.state.rootDir,
                AllowSend: this.state.allowSend,
                AllowReceive: this.state.allowReceive,
                AllowDelete: this.state.allowDelete,
                SkipHidden: this.state.skipHidden
            }

            invoke("profile_new_request", { profileData })
        } else {
            // TODO: better message or no message but show incorrect fields
            pushNotification({
                type: "error",
                text: "Failed to create profile: Requirements not fulfilled",
                time: 3000
            })

            this.waiting = false
            this.setState({ waiting: false })
        }
    }

    private onResult(e:Event<NewProfileResult.Message>) {
        if (e.payload.Success) {
            pushNotification({
                type: "success",
                text: "Profile \"" + this.state.name + "\" has been successfully created",
                time: 3000
            })

            goBack()
        } else {
            this.waiting = false
            this.setState({ waiting: false })

            pushNotification({
                type: "error",
                text: "Failed to create profile: Unknown error",
                time: 5000
            })
        }
    }
}
