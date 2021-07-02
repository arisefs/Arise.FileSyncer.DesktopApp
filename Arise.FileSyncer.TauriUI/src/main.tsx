import initUpdater from "./app-data/app-data-updater"
import initIpcEvents from "./ipc/ipcEvents"
await initUpdater()
await initIpcEvents()

import React from "react"
import ReactDOM from "react-dom"
import WindowDisplay from "./window/window-display"

import "./fonts.css"
import "./index.css"

ReactDOM.render(<React.StrictMode>
    <WindowDisplay />
</React.StrictMode>, document.getElementById("root"))
