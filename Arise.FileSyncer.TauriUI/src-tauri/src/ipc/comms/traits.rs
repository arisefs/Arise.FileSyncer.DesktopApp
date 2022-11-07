use super::IpcError;
use async_trait::async_trait;
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::fmt::Debug;
use tokio::sync::mpsc;

#[async_trait]
pub trait Connection {
    type Stream: Sync + Send;

    fn new(stream: Self::Stream) -> Self;

    fn stream(&mut self) -> &mut Self::Stream;

    /// Reads a message from the pipe
    async fn read<T: DeserializeOwned>(&mut self) -> Result<T, IpcError>;

    /// Sends a message to the pipe
    async fn send<T: Serialize + Send>(&mut self, msg: T) -> Result<(), IpcError>;
}

#[async_trait]
pub trait Client: Sized {
    async fn connect(addr: &'static str) -> Result<Self, IpcError>;
}

#[async_trait]
pub trait IpcStream {
    async fn readable(&self) -> std::io::Result<()>;
    async fn writable(&self) -> std::io::Result<()>;
}

pub trait IntoTask: 'static + Connection + Send + Sized {
    fn task<T>(self) -> (mpsc::Sender<T>, mpsc::Receiver<T>)
    where
        T: 'static + Debug + Serialize + DeserializeOwned + Send,
    {
        const TAG: &str = "IPC task";

        let (send_tx, mut send_rx) = mpsc::channel::<T>(4);
        let (recv_tx, recv_rx) = mpsc::channel::<T>(4);

        // TODO !! stream.read is NOT cancel safe !!
        tokio::spawn(async move {
            let mut stream = self;
            loop {
                tokio::select! {
                    msgo = send_rx.recv() => {
                        match msgo {
                            Some(msg) => if let Err(e) = stream.send(msg).await {
                                log::trace!("{TAG}: failed to send message to stream: {e}");
                                break;
                            },
                            None => {
                                log::trace!("{TAG}: send_rx failed: send_tx probably closed");
                                break;
                            }
                        }
                    },
                    msgr = stream.read() => {
                        match msgr {
                            Ok(msg) => if let Err(e) = recv_tx.send(msg).await {
                                log::trace!("{TAG}: recv_tx failed: recv_rx probably closed: {e}");
                            },
                            Err(e) => {
                                log::trace!("{TAG}: failed to read stream: {e}");
                            }
                        }
                    },
                }
            }
            log::info!("{TAG}: exited");
        });

        (send_tx, recv_rx)
    }
}

mod native {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use crate::ipc::comms::util as stream;
    use crate::ipc::comms::MAXLEN;

    pub async fn read<C: Connection, T: DeserializeOwned>(connection: &mut C) -> Result<T, IpcError>
    where
        C::Stream: IpcStream + AsyncReadExt + Unpin,
    {
        connection.stream().readable().await?;
        let length = stream::read_len(&mut connection.stream(), MAXLEN).await?;
        let data = stream::read_data(&mut connection.stream(), length).await?;
        let decoded = json::from_slice(&data)?;
        Ok(decoded)
    }

    pub async fn send<C: Connection, T: Serialize + Send>(
        connection: &mut C,
        msg: T,
    ) -> Result<(), IpcError>
    where
        C::Stream: IpcStream + AsyncWriteExt + Unpin,
    {
        let encoded = json::to_vec(&msg)?;
        connection.stream().writable().await?;
        stream::send_data(&mut connection.stream(), encoded, MAXLEN).await?;
        Ok(())
    }
}

pub use native::*;
