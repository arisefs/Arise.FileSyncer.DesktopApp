use crate::traits::{Client, Connection, IntoTask, IpcStream};
use crate::IpcError;
use async_trait::async_trait;
use tokio::net::UnixStream;

#[async_trait]
impl IpcStream for UnixStream {
    async fn readable(&self) -> std::io::Result<()> {
        self.readable().await
    }

    async fn writable(&self) -> std::io::Result<()> {
        self.writable().await
    }
}

#[derive(Debug)]
pub struct IpcConnection {
    stream: UnixStream,
}

#[async_trait]
impl Connection for IpcConnection {
    type Stream = UnixStream;

    fn new(stream: Self::Stream) -> Self {
        Self { stream }
    }

    fn stream(&mut self) -> &mut Self::Stream {
        &mut self.stream
    }

    async fn read<T: DeserializeOwned>(&mut self) -> Result<T, IpcError> {
        read(self).await
    }

    async fn send<T: Serialize + Send>(&mut self, msg: T) -> Result<(), IpcError> {
        send(self, msg).await
    }
}

#[async_trait]
impl Client for IpcConnection {
    async fn connect(addr: &'static str) -> Result<Self, IpcError> {
        Ok(Self {
            stream: UnixStream::connect(addr).await?,
        })
    }
}

impl IntoTask for IpcConnection {}
