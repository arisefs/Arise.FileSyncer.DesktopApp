use super::{open_pipe, IpcConnection, IpcError};
use crate::messages::Message;
use std::fs::File;
use std::io::Read;

const RECEIVER: &str = "AriseFileSyncerFromServicePipe";

pub struct IpcReceiver {
    pipe: Option<File>,
    line_buffer: Vec<u8>,
}

impl IpcReceiver {
    pub fn new() -> Self {
        Self {
            pipe: None,
            line_buffer: Vec::new(),
        }
    }

    pub fn read_message(&mut self) -> Result<Message, IpcError> {
        if self.pipe.is_none() {
            return Err(IpcError::NotConnected);
        }

        let receiver = self.pipe.as_mut().unwrap();
        let mut read_buffer: [u8; 512] = [0; 512];

        loop {
            let mut messages = self.line_buffer.splitn(2, |&b| b == b'\n');
            let first = messages.next();
            let remaining = messages.next();

            if let Some(leftover) = remaining {
                if let Some(msgdata) = first {
                    let msg: Message = json::from_slice(msgdata)?;
                    self.line_buffer = leftover.into();
                    return Ok(msg);
                }
            }

            let read = receiver.read(&mut read_buffer)?;
            self.line_buffer.extend(&read_buffer[..read])
        }
    }
}

impl IpcConnection for IpcReceiver {
    fn connect(&mut self) -> Result<(), IpcError> {
        self.pipe = Some(open_pipe(RECEIVER, true)?);
        Ok(())
    }
}
