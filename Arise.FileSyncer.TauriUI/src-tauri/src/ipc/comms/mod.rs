mod traits;
mod util;

pub use traits::{Connection, IntoTask};


// Native Unix (Unix sockets)
#[cfg(target_family = "unix")]
mod unix;
#[cfg(target_family = "unix")]
pub use unix::*;

// Native Windows (Named Pipes)
#[cfg(target_family = "windows")]
mod windows;
#[cfg(target_family = "windows")]
pub use windows::*;

#[cfg(feature = "websocket")]
mod websocket;
#[cfg(feature = "websocket")]
pub use websocket::*;

use thiserror::Error;

const MAXLEN: u32 = 1_048_576;

#[derive(Error, Debug)]
pub enum IpcError {
    #[error("Failed to retrive next message, stream ended.")]
    StreamEnded,
    #[error("Failed to receive connection. (IpcServer task shut down?)")]
    Receive,
    #[error("Failed to transmit connection. (IpcServer receiver dropped?)")]
    Transmit,
    #[error("IO error")]
    Io(#[from] std::io::Error),
    #[error("Stream error")]
    Stream(#[from] util::StreamError),
    #[error("Json (de)serialize error")]
    Decode(#[from] json::Error),
    #[cfg(feature = "websocket")]
    #[error("Websocket error")]
    Websocket(#[from] tokio_tungstenite::tungstenite::Error),
}

#[cfg(test)]
mod tests {
    use super::traits::Client;

    use super::{Connection, IpcClient, IpcServer, TEST_ADDR};
    use std::time::Duration;

    type TestResult<T> = Result<T, Box<dyn std::error::Error>>;

    const TEST_SERVER: &str = "Hello from the server!";
    const TEST_CLIENT: &str = "Hello from the client!";

    #[tokio::test]
    async fn ipc_communication() {
        // Run IPC server
        let srv = tokio::spawn(async { server().await.unwrap() });

        // Wait for the server to start up porperly
        tokio::time::sleep(Duration::from_secs(0)).await;

        // Run IPC client
        let client = tokio::time::timeout(Duration::from_secs(1), client());
        client.await.unwrap().unwrap();

        // Let server finish
        let server = tokio::time::timeout(Duration::from_secs(1), srv);
        server.await.unwrap().unwrap();
    }

    async fn server() -> TestResult<()> {
        let mut server = IpcServer::new(TEST_ADDR);
        let mut connection = server.recv().await?;
        connection.send(TEST_SERVER).await?;
        let received = connection.read::<String>().await?;
        assert_eq!(received, TEST_CLIENT);
        Ok(())
    }

    async fn client() -> TestResult<()> {
        let mut client = IpcClient::connect(TEST_ADDR).await?;
        client.send(TEST_CLIENT).await?;
        let received = client.read::<String>().await?;
        assert_eq!(received, TEST_SERVER);
        Ok(())
    }
}
