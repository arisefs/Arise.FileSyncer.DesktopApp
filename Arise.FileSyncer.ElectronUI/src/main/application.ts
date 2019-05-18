import { ipcMain, BrowserWindow } from "electron";
import { IpcService } from "./ipc/ipcService";
import { SetAllowPairing, NewProfile, ReceivedProfileResult, SendProfile, DeleteProfile, EditProfile } from "./ipc/messages";

import * as shortcuts from "./shortcuts";
import * as path from "path";

class Application {
    private mainWindow: BrowserWindow;
    private ipcService: IpcService;

    constructor() {
        ipcMain.on("window-ready", this.onWindowReady.bind(this));
        ipcMain.on("profile-new-request", this.onNewProfileRequest.bind(this));
        ipcMain.on("set-allow-pairing", this.onSetAllowPairing.bind(this));
        ipcMain.on("accept-profile", this.onAcceptProfile.bind(this));
        ipcMain.on("delete-profile", this.onDeleteProfile.bind(this));
        ipcMain.on("share-profile", this.onShareProfile.bind(this));
        ipcMain.on("edit-profile", this.onEditProfile.bind(this));
    }

    /**
     * LoadActivity
     */
    public LoadActivity(activityName: string, props?: any) {
        this.SendToRenderer("window-load-activity", activityName, props || {});
    }

    /**
     * SendToRenderer
     */
    public SendToRenderer(channel: string, ...args: any[]) {
        if (this.mainWindow != null && this.mainWindow.webContents != null) {
            try {
                this.mainWindow.webContents.send(channel, ...args);
            } catch (error) {
                console.log("Error: " + error);
            }
        }
    }

    /**
     * GetMainWindow
     */
    public GetMainWindow(): BrowserWindow {
        return this.mainWindow;
    }

    /**
     * CreateMainWindow
     */
    public CreateMainWindow() {
        this.mainWindow = new BrowserWindow({
            frame: false,
            width: 900,
            height: 600,
            title: "Arise File Syncer - Manager",
            minWidth: 500,
            minHeight: 300,
            webPreferences: {
                nodeIntegration: true
            }
        });

        shortcuts.Register();
        this.mainWindow.on("closed", this.onWindowClosed.bind(this));
        this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    private onWindowClosed() {
        shortcuts.Unregister();
        this.mainWindow = null;
    }

    private onWindowReady(_e: any, _args: any) {
        this.LoadActivity("IpcStatusActivity");
        this.ipcService = new IpcService();
    }

    private onNewProfileRequest(_e: any, profileData: NewProfile.Data) {
        if (this.ipcService != null) {
            this.ipcService.Send(NewProfile.Create(profileData));
        }
    }

    private onSetAllowPairing(_e: any, allow: boolean) {
        if (this.ipcService != null) {
            this.ipcService.Send(SetAllowPairing.Create(allow));
        }
    }

    private onAcceptProfile(_e: any, data: ReceivedProfileResult.Data) {
        if (this.ipcService != null) {
            this.ipcService.Send(ReceivedProfileResult.Create(data));
        }
    }

    private onDeleteProfile(_e: any, profileId: string) {
        if (this.ipcService != null) {
            this.ipcService.Send(DeleteProfile.Create(profileId));
        }
    }

    private onShareProfile(_e: any, data: SendProfile.Data) {
        if (this.ipcService != null) {
            this.ipcService.Send(SendProfile.Create(data));
        }
    }

    private onEditProfile(_e: any, data: EditProfile.Data) {
        if (this.ipcService != null) {
            this.ipcService.Send(EditProfile.Create(data));
        }
    }
}

export const App: Application = new Application();
