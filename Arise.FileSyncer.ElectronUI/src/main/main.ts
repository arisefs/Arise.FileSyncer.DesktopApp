import { app } from "electron";
import { App } from "./application";

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on("ready", () => App.CreateMainWindow());

app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (App.GetMainWindow() === null) {
        App.CreateMainWindow();
    }
});
