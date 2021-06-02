import React from "react"

import "./page-title-bar.css"

interface PageTitleBarProps {
    useMini: boolean,
    title: string,
}

export class PageTitleBar extends React.Component<PageTitleBarProps, any> {
    constructor(props: PageTitleBarProps) {
        super(props)
    }

    public render() {
        let titleClass = "page-title-bar-title"

        if (this.props.useMini) {
            titleClass += " page-title-bar-title-mini"
        }

        return (
            <div className="page-title-bar">
                <div className={titleClass}>{this.props.title}</div>
                {this.props.children}
            </div>
        )
    }
}
