import React from "react";
import { PageTitleBar } from "../../../components/page-title-bar";
import { ipcRenderer } from "electron";
import { Button } from "../../../components/button";
import { NewProfileResult, NewProfile } from "../../../../main/ipc/messages";
import { goBack } from "../../page-controller";
import { pushNotification } from "../../notification-manager";
import { ProfileEditor, handleTextBoxChange, handleCheckBoxChange, handleDirectorySelected, checkEditorState } from "../../../components/editor";

interface NewProfilePageProps { }

interface NewProfilePageState {
    waiting: boolean,

    name: string,
    rootDir: string,
    allowSend: boolean,
    allowReceive: boolean,
    allowDelete: boolean,
    skipHidden: boolean,
}

export class NewProfilePage extends React.Component<NewProfilePageProps, NewProfilePageState> {
    private handleTextBoxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    private handleCheckBoxChange: (name: string) => void;
    private handleDirectorySelected: (filePaths: string[], bookmarks: string[]) => void;

    private waiting: boolean = false;

    constructor(props: NewProfilePageProps) {
        super(props);
        this.state = {
            waiting: false,
            name: "",
            rootDir: "",
            allowSend: false,
            allowReceive: false,
            allowDelete: false,
            skipHidden: true
        };

        this.handleTextBoxChange = handleTextBoxChange.bind(this);
        this.handleCheckBoxChange = handleCheckBoxChange.bind(this);
        this.handleDirectorySelected = handleDirectorySelected.bind(this);

        this.onResult = this.onResult.bind(this);
        this.onCreate = this.onCreate.bind(this);
    }

    public componentDidMount() {
        ipcRenderer.addListener("srvNewProfileResult", this.onResult);
    }

    public componentWillUnmount() {
        ipcRenderer.removeListener("srvNewProfileResult", this.onResult);
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
        );
    }

    private onCreate() {
        if (this.waiting) {
            return;
        }

        this.waiting = true;
        this.setState({ waiting: true });

        if (checkEditorState(this)) {
            let profileData: NewProfile.Data = {
                DisplayName: this.state.name,
                RootDirectory: this.state.rootDir,
                AllowSend: this.state.allowSend,
                AllowReceive: this.state.allowReceive,
                AllowDelete: this.state.allowDelete,
                SkipHidden: this.state.skipHidden
            }

            ipcRenderer.send("profile-new-request", profileData);
        } else {
            // TODO: better message or no message but show incorrect fields
            pushNotification({
                type: "error",
                text: "Failed to create profile: Requirements not fulfilled",
                time: 3000,
            });

            this.waiting = false;
            this.setState({ waiting: false });
        }
    }

    private onResult(_event: any, message: NewProfileResult.Message) {
        if (message.Success) {
            pushNotification({
                type: "success",
                text: "Profile \"" + this.state.name + "\" has been successfully created",
                time: 3000,
            });

            goBack();
        } else {
            this.waiting = false;
            this.setState({ waiting: false });

            pushNotification({
                type: "error",
                text: "Failed to create profile: Unknown error",
                time: 5000,
            });
        }
    }
}
