import React from "react";
import { PageTitleBar } from "../../components/page-title-bar";
import { handleTextBoxChange } from "../../components/editor";

require("./settings.css");

interface SettingsPageState {
    port: string,
    bufferSize: string,
    chunkCount: string,
}

export class SettingsPage extends React.Component<any, SettingsPageState> {
    private handleTextBoxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    constructor(props: any) {
        super(props);

        this.state = {
            port: "12345",
            bufferSize: "3456",
            chunkCount: "7",
        };

        this.handleTextBoxChange = handleTextBoxChange.bind(this);
    }

    public componentDidMount() {
    }

    public componentWillUnmount() {
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
                    <label>Node</label><label>v{process.versions.node}</label>
                    <label>Chrome</label><label>v{process.versions.chrome}</label>
                    <label>Electron</label><label>v{process.versions.electron}</label>
                    <label>React</label><label>v{React.version}</label>
                </div>
            </div>
        );
    }
}

