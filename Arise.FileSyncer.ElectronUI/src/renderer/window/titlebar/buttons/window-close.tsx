import React from "react";
import { WindowButton } from "../titlebar-button";
import { remote } from "electron";

const svgClose = `
    <line x1="0" y1="0" x2="10" y2="10" style="stroke:white;stroke-width:1;" />
    <line x1="10" y1="0" x2="0" y2="10" style="stroke:white;stroke-width:1;" />`;

export class CloseWindowButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return <WindowButton id="window-close-button" svg={svgClose} onClick={onClickClose} />;
    }
}

function onClickClose() {
    let window = remote.getCurrentWindow();
    window.close();
}
