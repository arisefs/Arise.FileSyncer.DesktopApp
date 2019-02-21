import { App } from "./application";
import { globalShortcut } from "electron";

export function Register() {
    globalShortcut.register("CommandOrControl+F12", () => {
        App.GetMainWindow().webContents.openDevTools();
    });
}

export function Unregister() {
    globalShortcut.unregister("CommandOrControl+F12");
}