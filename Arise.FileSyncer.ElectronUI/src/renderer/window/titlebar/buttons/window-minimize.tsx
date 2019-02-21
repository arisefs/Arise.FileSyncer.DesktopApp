import React from "react";
import { WindowButton } from "../titlebar-button";
import { remote } from "electron";

const svgMinimize = `<line x1="0" y1="5" x2="10" y2="5" style="stroke:white;stroke-width:2;" />`;

export class MinimizeWindowButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return <WindowButton id="window-minimize-button" svg={svgMinimize} onClick={onClickMinimize} />;
    }
}

function onClickMinimize() {
    let window = remote.getCurrentWindow();
    window.minimize();
}
