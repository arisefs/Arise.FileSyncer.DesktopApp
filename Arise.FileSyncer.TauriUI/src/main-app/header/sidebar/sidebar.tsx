import React from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { ConnectionList } from "./connection-list"
import { PageTitleBar } from "../../../components/page-title-bar"
import { Button } from "../../../components/button"

interface SidebarState {
    isPairingEnabled: boolean,
}

export class Sidebar extends React.Component<any, SidebarState> {
    constructor(props: any) {
        super(props)
        this.state = { isPairingEnabled: false }

        this.onSwitchAllowPairing = this.onSwitchAllowPairing.bind(this)
    }

    public render() {
        return (
            <div>
                <PageTitleBar useMini={true} title="Connections">
                    <Button style={(this.state.isPairingEnabled) ? "white" : "blue"}
                        className="page-title-bar-button" onClick={this.onSwitchAllowPairing}>
                        {(this.state.isPairingEnabled) ? "Disable Pairing" : "Enable Pairing"}
                    </Button>
                </PageTitleBar>
                <ConnectionList />
            </div>
        )
    }

    private onSwitchAllowPairing() {
        const newPairingState = !this.state.isPairingEnabled
        invoke("set_allow_pairing", { newPairingState })
        this.setState({ isPairingEnabled: newPairingState })
    }
}
