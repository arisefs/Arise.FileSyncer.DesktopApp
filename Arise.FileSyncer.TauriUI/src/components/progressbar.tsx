import React from "react"

import "./progressbar.css"

interface ProgressBarProps {
    leftLabel?: string,
    rightLabel?: string,
    progress?: number,
}

export class ProgressBar extends React.Component<ProgressBarProps, any> {
    constructor(props: ProgressBarProps) {
        super(props)
    }

    public render() {
        let bar

        if (this.props.progress === undefined) {
            bar = (<div className="progressbar-bar-indeterminate" />)
        } else {
            bar = (<div className="progressbar-bar-progress" style={{ width: (this.props.progress * 100) + "%" }} />)
        }

        return (
            <div className="progressbar-container">
                <div className="progressbar-label-left">{this.props.leftLabel}</div>
                <div className="progressbar-label-right">{this.props.rightLabel}</div>
                <div className="progressbar-bar">
                    {bar}
                </div>
            </div>
        )
    }
}
