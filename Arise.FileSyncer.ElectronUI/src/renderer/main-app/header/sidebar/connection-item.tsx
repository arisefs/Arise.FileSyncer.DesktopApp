import React from "react";
import { ProgressBar } from "../../../components/progressbar";
import { Interfaces } from "../../../app-data/app-data";
import { getPercent, getRemaining, formatNumber, formatSizeNumber } from "../../../app-data/extensions";

require("./connection-item.css");

interface ConnectionItemProps {
    name: string,
    progress: Interfaces.ProgressWithSpeed,
}

export class ConnectionItem extends React.Component<ConnectionItemProps, any> {
    constructor(props: ConnectionItemProps) {
        super(props);
    }

    public render() {
        let percent;
        let remaining;
        let speed;

        if (!this.props.progress.indeterminate) {
            percent = getPercent(this.props.progress);
            let remainingNum = getRemaining(this.props.progress);
            if (remainingNum != null) {
                remaining = formatNumber(remainingNum) + " KB";
                speed = formatSizeNumber(this.props.progress.speed) + "/s"
            }
        }

        return (
            <div className="connection-item-container">
                <div>{this.props.name}</div>
                <ProgressBar progress={percent} rightLabel={remaining} leftLabel={speed} />
            </div>
        );
    }
}
