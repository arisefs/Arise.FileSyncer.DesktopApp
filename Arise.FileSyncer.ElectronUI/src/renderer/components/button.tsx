import React from "react";

require("./button.css");

interface ButtonProps {
    style: string,
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void,
    disabled?: boolean,
    id?: string,
    className?: string,
}

export class Button extends React.Component<ButtonProps, any> {
    constructor(props: ButtonProps) {
        super(props);
    }

    public render() {
        return (
            <div id={this.props.id} className={this.getClassName()} onClick={this.onClicked.bind(this)}>
                {this.props.children}
            </div>
        );
    }

    private onClicked(event: React.MouseEvent<HTMLDivElement>) {
        if (!this.props.disabled) {
            this.props.onClick(event);
        }
    }

    private getClassName() {
        let cStyle = "button-" + this.props.style;

        if (this.props.disabled) {
            cStyle += "-disabled";
        }

        if (this.props.className != null) {
            cStyle += " " + this.props.className;
        }

        return "button " + cStyle;
    }
}
