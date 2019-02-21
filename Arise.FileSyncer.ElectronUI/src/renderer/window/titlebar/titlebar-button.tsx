import React from "react";

interface WindowButtonProps {
    id: string
    svg: string
    onClick: (event: any) => any
}

export class WindowButton extends React.Component<WindowButtonProps, any> {
    constructor(props: WindowButtonProps) {
        super(props);
    }

    public render() {
        return (
            <div className="titlebar-button" id={this.props.id} onClick={this.props.onClick}>
                <svg height="10" width="10" dangerouslySetInnerHTML={{ __html: this.props.svg }} />
            </div>
        );
    }
}