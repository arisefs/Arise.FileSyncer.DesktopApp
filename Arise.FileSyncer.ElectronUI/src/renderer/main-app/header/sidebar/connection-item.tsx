import React from "react";
import { ProgressBar } from "../../../components/progressbar";
import { Interfaces } from "../../../app-data/app-data";
import { getPercent, getRemaining, getRemainingTime, formatSizeNumber, formatTimeNumber } from "../../../app-data/extensions";

require("./connection-item.css");

interface ConnectionItemProps {
    name: string,
    progress: Interfaces.Progress,
}

export class ConnectionItem extends React.Component<ConnectionItemProps, any> {
    constructor(props: ConnectionItemProps) {
        super(props);
    }

    public render() {
        let percent;
        let remaining;
        let leftLabel;

        if (!this.props.progress.indeterminate) {
            percent = getPercent(this.props.progress);
            let remainingTime = getRemainingTime(this.props.progress);
            if (remainingTime != null) {
                remaining = formatTimeNumber(remainingTime) + " remaining";
                leftLabel = formatSizeNumber(this.props.progress.speed) + "/s | ";
                leftLabel += formatSizeNumber(getRemaining(this.props.progress));
            }
        }

        return (
            <div className="connection-item-container">
                <div>{this.props.name}</div>
                <ProgressBar progress={percent} rightLabel={remaining} leftLabel={leftLabel} />
            </div>
        );
    }
}
