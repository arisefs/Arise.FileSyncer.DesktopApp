import * as path from "path";
import * as os from "os";
import * as ipc from "node-ipc";

ipc.config.retry = 2000;
ipc.config.rawBuffer = true;
ipc.config.encoding = 'utf8';
ipc.config.silent = true;

export class IpcConnection {
    public OnReceived: (data: any) => void;
    public OnConnected: () => void;
    public OnDisconnected: () => void;

    private connected: boolean;
    private connectedSender: boolean;
    private connectedReceiver: boolean;
    private receiveBuffer: string;

    constructor() {
        this.connected = false;
        this.connectedSender = false;
        this.connectedReceiver = false;
        this.receiveBuffer = "";

        const ipcPathBase = this.getIpcPathBase();

        ipc.connectTo("sender", ipcPathBase + "AriseFileSyncerToServicePipe", () => {
            ipc.of.sender.on("connect", () => {
                this.connectedSender = true;
                this.onConnected();
            });
            ipc.of.sender.on("disconnect", () => {
                this.connectedSender = false;
                this.onDisconnected();
            });
            ipc.of.sender.on("data", this.onData.bind(this));
            ipc.of.sender.on("error", this.onError.bind(this));
        });

        ipc.connectTo("receiver", ipcPathBase + "AriseFileSyncerFromServicePipe", () => {
            ipc.of.receiver.on("connect", () => {
                this.connectedReceiver = true;
                this.onConnected();
            });
            ipc.of.receiver.on("disconnect", () => {
                this.connectedReceiver = false;
                this.onDisconnected();
            });
            ipc.of.receiver.on("data", this.onData.bind(this));
            ipc.of.receiver.on("error", this.onError.bind(this));
        });
    }

    /**
     * Send
     */
    public Send(data: any) {
        if (this.connected) {
            ipc.of.sender.emit(JSON.stringify(data) + "\n");
        }
    }

    private lineReceived(line: string) {
        if (this.OnReceived != null) {
            this.OnReceived(JSON.parse(line));
        }
    }

    private onConnected() {
        if (this.connectedSender && this.connectedReceiver) {
            this.connected = true;
            console.log("IPC Connected");

            if (this.OnConnected != null) {
                this.OnConnected();
            }
        }
    }

    private onDisconnected() {
        if (this.connected) {
            this.connected = false;
            this.receiveBuffer = "";
            console.log("IPC Disconnected");

            if (this.OnDisconnected != null) {
                this.OnDisconnected();
            }
        }
    }

    private onError(err: any) {
        console.log("IPC Error: " + err);
    }

    private onData(data: Buffer) {
        //Split data by newline
        let dataString = data.toString()
        let dataArray = dataString.split("\n");

        //Check if the first element isn't the last
        if (dataArray.length > 1) {
            //Add stored data to the first element and call lineReceived
            this.lineReceived(this.receiveBuffer + dataArray[0]);

            //Iterate from the second to the second last element and call lineReceived on them
            for (let i = 1; i < dataArray.length - 1; i++) {
                this.lineReceived(dataArray[i]);
            }
        }

        //If the array has any element, store the last element in the buffer
        if (dataArray.length > 0) {
            this.receiveBuffer = dataArray[dataArray.length - 1];
        }
    }

    private getIpcPathBase(): string {
        if (process.platform === "win32") {
            return ""; // "\\\\?\\pipe\\";
        } else {
            return path.join(os.tmpdir(), "CoreFxPipe_");
        }
    }
}
