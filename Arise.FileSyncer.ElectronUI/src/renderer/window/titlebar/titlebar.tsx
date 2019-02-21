import React from "react";
import { remote } from "electron";
import { MinimizeWindowButton } from "./buttons/window-minimize";
import { MaximizeWindowButton } from "./buttons/window-maximize";
import { CloseWindowButton } from "./buttons/window-close";

require("./titlebar.css");

interface WindowTitleBarState {
    titleText: string
}

export class WindowTitleBar extends React.Component<any, WindowTitleBarState> {
    constructor(props: any) {
        super(props);
        this.state = { titleText: "" };
    }

    public componentDidMount() {
        this.updateTitle();
    }

    public componentWillUnmount() {
    }

    public render() {
        return (
            <div className="window-titlebar">
                <div className="window-title">{this.state.titleText}</div>
                <MinimizeWindowButton />
                <MaximizeWindowButton />
                <CloseWindowButton />
            </div>
        );
    }

    private updateTitle() {
        this.setState({
            titleText: getWindowTitle()
        });
    }
}

function getWindowTitle(): string {
    let window = remote.getCurrentWindow();
    return window.getTitle();
}
