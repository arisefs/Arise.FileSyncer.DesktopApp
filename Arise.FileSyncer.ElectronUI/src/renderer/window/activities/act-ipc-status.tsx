import React from "react";

require("./act-ipc-status.css");

const textConnecting = "Connecting to service...";
const textLostConnection = "Lost connection with service. Retrying...";

export class IpcStatusActivity extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="act-ipc-status">
                {(this.props.lostConnection) ? textLostConnection : textConnecting}
            </div>
        );
    }
}