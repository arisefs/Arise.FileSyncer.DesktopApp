import initUpdater from "./app-data/app-data-updater"
import initIpcEvents from "./ipc/ipcEvents"

import React from "react"
import ReactDOM from "react-dom/client"
import WindowDisplay from "./window/window-display"

import "./fonts.css"
import "./index.css"

async function main() {
    await initUpdater()
    await initIpcEvents()

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <WindowDisplay />
        </React.StrictMode>
    )
}

main()
