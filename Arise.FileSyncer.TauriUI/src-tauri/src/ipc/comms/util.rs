use thiserror::Error;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio_util::sync::CancellationToken;
use std::{error::Error, future::Future};

/// Reads the message length.
pub async fn read_len<T>(stream: &mut T, maxlen: u32) -> Result<usize, StreamError>
where
    T: AsyncReadExt + Unpin,
{
    let mut buffer = [0; 4];
    let read = stream
        .read_exact(&mut buffer)
        .await
        .map_err(StreamError::StreamRead)?;
    debug_assert_eq!(read, 4);

    let length = u32::from_le_bytes(buffer);
    if length < maxlen {
        Ok(length as usize)
    } else {
        Err(StreamError::MessageTooLarge {
            len: length,
            max: maxlen,
        })
    }
}

/// Reads the message data.
pub async fn read_data<T>(stream: &mut T, length: usize) -> Result<Vec<u8>, StreamError>
where
    T: AsyncReadExt + Unpin,
{
    let mut buffer = vec![0; length];
    let read = stream
        .read_exact(&mut buffer)
        .await
        .map_err(StreamError::StreamRead)?;
    debug_assert_eq!(read, length);
    Ok(buffer)
}

/// Sends a message.
pub async fn send_data<T>(stream: &mut T, data: Vec<u8>, maxlen: u32) -> Result<(), StreamError>
where
    T: AsyncWriteExt + Unpin,
{
    let length = data.len() as u32;
    debug_assert!(length < maxlen);

    stream
        .write_all(&length.to_le_bytes())
        .await
        .map_err(StreamError::StreamWrite)?;
    stream
        .write_all(&data)
        .await
        .map_err(StreamError::StreamWrite)?;

    Ok(())
}

#[derive(Error, Debug)]
pub enum StreamError {
    #[error("Message size too large: recv: {len}, max: {max}")]
    MessageTooLarge { len: u32, max: u32 },
    #[error("Failed to read from TCP stream")]
    StreamRead(#[source] std::io::Error),
    #[error("Failed to write to TCP stream")]
    StreamWrite(#[source] std::io::Error),
    #[error("Failed to flush TCP stream")]
    StreamFlush(#[source] std::io::Error),
}

#[derive(Debug, Default)]
pub struct Canceller {
    token: CancellationToken,
}

impl Canceller {
    pub fn new() -> Self {
        Self {
            token: CancellationToken::new(),
        }
    }

    pub fn child(&self) -> CancellationToken {
        self.token.child_token()
    }

    pub fn cancel(&self) {
        self.token.cancel()
    }
}

impl Drop for Canceller {
    fn drop(&mut self) {
        self.cancel()
    }
}


/// Cancellable task runner with error handling.
///
/// The future needs to be cancel safe.
pub async fn task<N, F, T, E>(name: N, future: F, token: CancellationToken)
where
    N: AsRef<str>,
    F: Future<Output = Result<T, E>>,
    E: Error,
{
    tokio::select! {
        result = future => {
            if let Err(err) = result {
                if let Some(src) = err.source() {
                    log::error!("{} fatal error: {} ({})", name.as_ref(), err, src);
                } else {
                    log::error!("{} fatal error: {}", name.as_ref(), err);
                }
            } else {
                log::warn!("{} exited without failing or being cancelled", name.as_ref());
            }
        }
        _ = token.cancelled() => log::info!("{} cancelled", name.as_ref())
    }
}
