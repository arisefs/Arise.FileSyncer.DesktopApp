import React from "react";
import { PageTitleBar } from "../../components/page-title-bar";

require("./settings.css");

export class SettingsPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
    }

    public componentWillUnmount() {
    }

    public render() {
        return (
            <div className="base-page settings-page">
                <PageTitleBar useMini={false} title="Settings" />
                <div className="settings-port">
                    Discovery Port:
                    <div className="settings-port-editor">
                        <input type="number" name="port" value={12345} placeholder="Port number" />
                        <button type="button" className="button-blue">Update</button>
                    </div>
                </div>
                <div className="settings-divider" />
                <PageTitleBar useMini={false} title="About" />
                Node: {process.versions.node}<br />
                Chrome: {process.versions.chrome}<br />
                Electron: {process.versions.electron}<br />
                React: {React.version}<br />
            </div>
        );
    }
}
