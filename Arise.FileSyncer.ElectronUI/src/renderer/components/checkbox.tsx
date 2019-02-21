import React from "react";

require("./checkbox.css");

interface CheckBoxProps {
    name?: string,
    checked?: boolean,
    disabled?: boolean,
    onChange?: (name: string) => void,
}

export class CheckBox extends React.Component<CheckBoxProps, any> {
    constructor(props: CheckBoxProps) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    public render() {
        let checkmarkClass = "checkbox-checkmark checkbox-checkmark-";

        if (this.props.checked) {
            checkmarkClass += "checked";
        } else {
            checkmarkClass += "unchecked";
        }

        return (
            <div className="checkbox" onClick={this.onClick}>
                <div className={checkmarkClass}>
                    <svg height="16" width="16">
                        <path d="M3.5 7 L6.5 10 L12.5 4" style={{ fill: "none", stroke: "white", strokeWidth: 2 }} />
                    </svg>
                </div>
                <label className="checkbox-label">
                    {this.props.children}
                </label>
            </div>
        );
    }

    private onClick() {
        if (!this.props.disabled) {
            this.props.onChange(this.props.name);
        }
    }
}
