import React from "react";
import { WindowButton } from "../titlebar-button";
import { remote } from "electron";

const svgMaximize = `<rect width="10" height="10" style="stroke:white;stroke-width:2;fill-opacity:0;" />`;

export class MaximizeWindowButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return <WindowButton id="window-maximize-button" svg={svgMaximize} onClick={onClickMaximize} />;
    }
}

function onClickMaximize() {
    let window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    } else {
        window.unmaximize();
    }
}
