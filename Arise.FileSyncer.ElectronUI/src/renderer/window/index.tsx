import React from "react";
import ReactDOM from "react-dom";
import { WindowTitleBar } from "./titlebar/titlebar";
import { WindowDisplay } from "./window-display";

require("./fonts.css");
require("./index.css");

ReactDOM.render((
    <div id="react-root">
        <WindowTitleBar />
        <WindowDisplay />
    </div>
), document.getElementById('root'));