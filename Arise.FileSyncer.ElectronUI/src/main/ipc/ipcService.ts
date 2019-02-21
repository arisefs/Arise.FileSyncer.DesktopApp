import { IpcConnection } from "./ipcConnection";
import { IpcMessage } from "./ipcMessage";
import * as Message from "./messages";
import { App } from "../application";

export class IpcService {
    private connection: IpcConnection;

    constructor() {
        this.connection = new IpcConnection();
        this.connection.OnReceived = this.onReceived.bind(this);
        this.connection.OnConnected = this.onConnected.bind(this);
        this.connection.OnDisconnected = this.onDisconnected.bind(this);
    }

    public Send(message: IpcMessage) {
        this.connection.Send(message);
    }

    private onConnected() {
        this.Send(Message.Welcome.Create());
    }

    private onDisconnected() {
        App.LoadActivity("IpcStatusActivity", { lostConnection: true });
    }

    private onReceived(message: any) {
        switch (message.Command) {
            case Message.Initialization.Command:
                App.SendToRenderer("srvInitialization", message);
                break;
            case Message.Update.Command:
                App.SendToRenderer("srvUpdate", message);
                break;
            case Message.NewProfileResult.Command:
                App.SendToRenderer("srvNewProfileResult", message);
                break;
            case Message.ConnectionAdded.Command:
                App.SendToRenderer("srvConnectionAdded", message);
                break;
            case Message.ConnectionVerified.Command:
                App.SendToRenderer("srvConnectionVerified", message);
                break;
            case Message.ConnectionRemoved.Command:
                App.SendToRenderer("srvConnectionRemoved", message);
                break;
            case Message.ReceivedProfile.Command:
                App.SendToRenderer("srvReceivedProfile", message);
                break;
            case Message.ProfileAdded.Command:
                App.SendToRenderer("srvProfileAdded", message);
                break;
            case Message.ProfileChanged.Command:
                App.SendToRenderer("srvProfileChanged", message);
                break;
            case Message.ProfileRemoved.Command:
                App.SendToRenderer("srvProfileRemoved", message);
                break;
            case Message.DeleteProfileResult.Command:
                App.SendToRenderer("srvDeleteProfileResult", message);
                break;
            case Message.EditProfileResult.Command:
                App.SendToRenderer("srvEditProfileResult", message);
                break;
            default:
                console.log("Received unknown message");
                break;
        }
    }
}
