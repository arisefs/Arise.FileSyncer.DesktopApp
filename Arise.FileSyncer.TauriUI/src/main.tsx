import initUpdater from "./app-data/app-data-updater"
import initIpcEvents from "./ipc/ipcEvents"

import React from "react"
import ReactDOM from "react-dom"
import WindowDisplay from "./window/window-display"

import "./fonts.css"
import "./index.css"

async function main() {
    await initUpdater()
    await initIpcEvents()

    ReactDOM.render(<React.StrictMode>
        <WindowDisplay />
    </React.StrictMode>, document.getElementById("root"))
}

main()
