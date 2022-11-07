use crate::ipc::comms::traits::{read, send, Connection, IntoTask, IpcStream};
use crate::ipc::comms::IpcError;
use async_trait::async_trait;
use serde::{de::DeserializeOwned, Serialize};
use tokio::net::windows::named_pipe::NamedPipeServer;

#[async_trait]
impl IpcStream for NamedPipeServer {
    async fn readable(&self) -> std::io::Result<()> {
        self.readable().await
    }

    async fn writable(&self) -> std::io::Result<()> {
        self.writable().await
    }
}

#[derive(Debug)]
pub struct IpcConnection {
    stream: NamedPipeServer,
}

#[async_trait]
impl Connection for IpcConnection {
    type Stream = NamedPipeServer;

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

impl IntoTask for IpcConnection {}
