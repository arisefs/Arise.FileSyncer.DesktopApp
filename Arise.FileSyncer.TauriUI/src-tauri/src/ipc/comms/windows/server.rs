use super::IpcConnection;
use crate::ipc::comms::{Connection, IpcError};
use tokio::net::windows::named_pipe::{PipeMode, ServerOptions};
use tokio::sync::mpsc;
use crate::ipc::comms::util::{self, Canceller};

type Receiver = mpsc::Receiver<IpcConnection>;

#[derive(Debug)]
pub struct IpcServer {
    receiver: Receiver,
    token: Canceller,
}

impl IpcServer {
    pub fn new(addr: &'static str) -> Self {
        let (dtx, drx) = mpsc::channel(2);

        let token = Canceller::new();
        let ctoken = token.child();

        tokio::spawn(async move {
            util::task("IPC Manager", Self::listen(addr, dtx), ctoken).await;
        });

        Self {
            receiver: drx,
            token,
        }
    }

    pub async fn recv(&mut self) -> Result<IpcConnection, IpcError> {
        self.receiver.recv().await.ok_or(IpcError::Receive)
    }

    pub fn cancel(self) {
        self.token.cancel();
    }

    async fn listen(addr: &'static str, dtx: mpsc::Sender<IpcConnection>) -> Result<(), IpcError> {
        let mut options = ServerOptions::new();
        options.pipe_mode(PipeMode::Byte);

        loop {
            let server = options.create(addr)?;
            server.connect().await?;

            if dtx.send(IpcConnection::new(server)).await.is_err() {
                return Err(IpcError::Transmit);
            }
        }
    }
}
