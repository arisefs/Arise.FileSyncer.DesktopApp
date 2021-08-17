import React from "react"
import { open as openDialog } from "@tauri-apps/api/dialog"
import { Button } from "./button"
import { CheckBox } from "./checkbox"

import "./editor.css"

export interface ProfileEditorProps {
    disable: boolean,
    disableSH: boolean,

    name: string,
    rootDir: string,
    allowSend: boolean,
    allowReceive: boolean,
    allowDelete: boolean,
    skipHidden: boolean,

    onTextBoxChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onCheckBoxChange: (name: string) => void,
    onDirectorySelected: (path: string) => void,
}

export class ProfileEditor extends React.Component<ProfileEditorProps> {
    constructor(props: ProfileEditorProps) {
        super(props)

        this.onBrowse = this.onBrowse.bind(this)
    }

    public render() {
        return (
            <div className="editor-profile-grid">
                <div className="editor-profile-grid-top">
                    <div className="editor-profile-name-container editor-profile-top-container">
                        <div className="editor-profile-name-label editor-profile-top-label">
                            Profile name:
                        </div>
                        <input type="text" name="name" value={this.props.name} onChange={this.props.onTextBoxChange}
                            disabled={this.props.disable} placeholder="The profile's display name. Ex: My Photos" />
                    </div>
                    <div className="editor-profile-dir-container editor-profile-top-container">
                        <div className="editor-profile-dir-label editor-profile-top-label">
                            Sync Directory:
                        </div>
                        <input type="text" name="rootDir" value={this.props.rootDir} onChange={this.props.onTextBoxChange}
                            disabled={this.props.disable} placeholder="The directory to synchronize. Ex: C:\\My Documents" />
                        <Button style="white" onClick={this.onBrowse} disabled={this.props.disable}>Browse</Button>
                    </div>
                </div>
                <div className="editor-profile-grid-left">
                    <CheckBox name="allowSend" checked={this.props.allowSend}
                        onChange={this.props.onCheckBoxChange} disabled={this.props.disable}>
                        Allow sending files from this device
                    </CheckBox>
                    <CheckBox name="allowReceive" checked={this.props.allowReceive}
                        onChange={this.props.onCheckBoxChange} disabled={this.props.disable}>
                        Allow receiving files from other devices
                    </CheckBox>
                    <CheckBox name="allowDelete" checked={this.props.allowDelete}
                        onChange={this.props.onCheckBoxChange} disabled={this.props.disable}>
                        Allow deletion of local files
                    </CheckBox>
                    <div className="editor-profile-spacer" />
                    <CheckBox name="skipHidden" checked={this.props.skipHidden}
                        onChange={this.props.onCheckBoxChange} disabled={this.props.disableSH}>
                        Skip hidden files and directories
                    </CheckBox>
                </div>
                <div className="editor-profile-grid-right">
                    Plugin select
                </div>
            </div>
        )
    }

    private onBrowse() {
        openDialog({ directory: true }).then((v) => this.props.onDirectorySelected(v as string))
    }
}

export function handleTextBoxChange(this: any, event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value })
}

export function handleCheckBoxChange(this: any, name: string) {
    this.setState({ [name]: !this.state[name] })
}

export function handleDirectorySelected(this: any, path: string) {
    this.setState({ rootDir: path })
}

export function checkEditorState(reactComponent: any): boolean {
    if (reactComponent.state.name.length < 3) {
        return false
    }

    // TODO: Check if directory exists
    //if (!existsSync(reactComponent.state.rootDir)) {
    //    return false;
    //}

    if (!reactComponent.state.allowSend && !reactComponent.state.allowReceive) {
        return false
    }

    return true
}
