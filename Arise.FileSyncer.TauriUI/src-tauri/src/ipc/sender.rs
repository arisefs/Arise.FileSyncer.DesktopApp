use super::{open_pipe, IpcConnection, IpcError};
use crate::messages::Message;
use std::fs::File;
use std::io::Write;

const SENDER: &str = "AriseFileSyncerToServicePipe";

pub struct IpcSender {
    pipe: Option<File>,
}

impl IpcSender {
    pub fn new() -> Self {
        Self { pipe: None }
    }

    pub fn send(&mut self, message: &Message) -> Result<(), IpcError> {
        if self.pipe.is_none() {
            return Err(IpcError::NotConnected);
        }

        // None is checked above
        let sender = self.pipe.as_mut().unwrap();

        sender.write_all(&json::to_vec(&message)?)?;
        sender.write_all(b"\n")?;

        Ok(())
    }
}

impl IpcConnection for IpcSender {
    fn connect(&mut self) -> Result<(), IpcError> {
        self.pipe = Some(open_pipe(SENDER, false)?);
        Ok(())
    }
}
