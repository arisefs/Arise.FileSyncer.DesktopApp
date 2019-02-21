import React from "react";

require("./header-button.css");

interface HeaderButtonProps {
    svgPath: string,
    extraClasses: string,
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

export class HeaderButton extends React.Component<HeaderButtonProps, any> {
    constructor(props: HeaderButtonProps) {
        super(props);
    }

    public render() {
        return (
            <div className={"main-header-button " + this.props.extraClasses} onClick={this.props.onClick}>
                <img src={this.props.svgPath} draggable={false} />
            </div>
        );
    }
}