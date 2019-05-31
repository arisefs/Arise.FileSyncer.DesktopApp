import React from "react";
import ReactDOM from "react-dom";
import { WindowTitleBar } from "./titlebar/titlebar";
import { WindowDisplay } from "./window-display";

import * as os from "os";

const isWin = os.platform() === "win32";

require("./fonts.css");
require("./index.css");

ReactDOM.render((
    <div id="react-root">
        {isWin && <WindowTitleBar />}
        <WindowDisplay />
    </div>
), document.getElementById('root'));