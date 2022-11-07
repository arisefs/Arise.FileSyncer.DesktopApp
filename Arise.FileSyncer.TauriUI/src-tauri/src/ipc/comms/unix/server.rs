use super::IpcConnection;
use crate::{Connection, IpcError};
use std::path::Path;
use tokio::net::UnixListener;
use tokio::sync::mpsc;
use util::Canceller;

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
            let path = Path::new(addr);
            util::task("IPC Manager", Self::listen(path, dtx), ctoken).await;

            if let Err(e) = clear(path).await {
                log::warn!("Failed to clean up after IPC listener. ({e})");
            }
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

    async fn listen(addr: &Path, dtx: mpsc::Sender<IpcConnection>) -> Result<(), IpcError> {
        clear(addr).await?;
        let listener = UnixListener::bind(addr)?;

        loop {
            match listener.accept().await {
                Ok((stream, _addr)) => {
                    if dtx.send(IpcConnection::new(stream)).await.is_err() {
                        return Err(IpcError::Transmit);
                    }
                }
                Err(e) => {
                    log::warn!("Failed to accept Unix socket. ({e})");
                }
            }
        }
    }
}

async fn clear(path: &Path) -> Result<(), IpcError> {
    if path.exists() {
        tokio::fs::remove_file(path).await?;
    }
    Ok(())
}
