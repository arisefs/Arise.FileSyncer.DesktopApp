use crate::ipc::comms::traits::{read, send, Client, Connection, IpcStream};
use crate::ipc::comms::IpcError;
use async_trait::async_trait;
use serde::de::DeserializeOwned;
use serde::Serialize;
use tokio::net::windows::named_pipe::{ClientOptions, NamedPipeClient};

#[async_trait]
impl IpcStream for NamedPipeClient {
    async fn readable(&self) -> std::io::Result<()> {
        self.readable().await
    }

    async fn writable(&self) -> std::io::Result<()> {
        self.writable().await
    }
}

#[derive(Debug)]
pub struct IpcClient {
    stream: NamedPipeClient,
}

#[async_trait]
impl Connection for IpcClient {
    type Stream = NamedPipeClient;

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
impl Client for IpcClient {
    async fn connect(addr: &'static str) -> Result<Self, IpcError> {
        Ok(Self {
            stream: ClientOptions::new().open(addr)?,
        })
    }
}
