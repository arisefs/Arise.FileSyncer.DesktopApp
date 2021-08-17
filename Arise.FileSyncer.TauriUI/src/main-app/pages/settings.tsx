import React from "react"
import { PageTitleBar } from "../../components/page-title-bar"
import { handleTextBoxChange } from "../../components/editor"
import { app } from "@tauri-apps/api"

import "./settings.css"

interface SettingsPageState {
    port: string,
    bufferSize: string,
    chunkCount: string,
    versionApp: string,
    versionTauri: string
}

export class SettingsPage extends React.Component<any, SettingsPageState> {
    private handleTextBoxChange: (event: React.ChangeEvent<HTMLInputElement>) => void

    constructor(props: any) {
        super(props)

        this.state = {
            port: "12345",
            bufferSize: "3456",
            chunkCount: "7",
            versionApp: "Loading...",
            versionTauri: "Loading..."
        }

        this.handleTextBoxChange = handleTextBoxChange.bind(this)
    }

    public componentDidMount() {
        this.fetchVersions()
    }

    private async fetchVersions() {
        this.setState({
            versionApp: "v" + await app.getVersion(),
            versionTauri: "v" + await app.getTauriVersion()
        })
    }

    public render() {
        return (
            <div className="base-page settings-page">
                <PageTitleBar useMini={false} title="Settings" />
                <div className="settings-optionsgrid">
                    <div className="settings-numerical-text">
                        Network Port
                    </div>
                    <div className="settings-numerical-editor">
                        <input type="number" name="port" value={this.state.port} onChange={this.handleTextBoxChange}
                            placeholder="Port number" size={1} />
                        <button type="button" className="button-blue">Update</button>
                    </div>
                    <div className="settings-numerical-text">
                        Buffer size
                    </div>
                    <div className="settings-numerical-editor">
                        <input type="number" name="bufferSize" value={this.state.bufferSize} onChange={this.handleTextBoxChange}
                            placeholder="Size of the buffer" size={1} />
                        <button type="button" className="button-blue">Update</button>
                    </div>
                    <div className="settings-numerical-text">
                        File chunk count
                    </div>
                    <div className="settings-numerical-editor">
                        <input type="number" name="chunkCount" value={this.state.chunkCount} onChange={this.handleTextBoxChange}
                            placeholder="Number of chunks of the file to queue up" size={1} />
                        <button type="button" className="button-blue">Update</button>
                    </div>
                </div>
                <div className="settings-divider" />
                <PageTitleBar useMini={false} title="About" />
                <div className="settings-aboutgrid">
                    <label>Application</label><label>{this.state.versionApp}</label>
                    <label>Tauri</label><label>{this.state.versionTauri}</label>
                    <label>React</label><label>v{React.version}</label>
                </div>
            </div>
        )
    }
}

