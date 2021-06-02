mod receiver;
mod sender;

use crate::messages::Message;
use channel::{Receiver, Sender};
use receiver::IpcReceiver;
use sender::IpcSender;
use std::fs::{File, OpenOptions};
use std::path::Path;
use std::time::Duration;

////! TODO
////! Handle data after disconnects! (clear cached data and message queues)
////!

pub enum IpcEvent {
    Message(Message),
    Connected,
    Disconnected,
}

pub struct IpcService {
    pub sender: Sender<Message>,
    pub receiver: Receiver<IpcEvent>,
}

impl IpcService {
    pub fn new() -> Self {
        let (sender, from_sender) = channel::unbounded();
        let (to_receiver, receiver) = channel::unbounded();

        std::thread::spawn(move || Self::sender_thread(from_sender));
        std::thread::spawn(move || Self::receiver_thread(to_receiver));

        Self { sender, receiver }
    }

    fn sender_thread(receiver: Receiver<Message>) {
        let mut ipc_sender = IpcSender::new();

        loop {
            match ipc_sender.connect() {
                Ok(_) => Self::handle_send(&mut ipc_sender, &receiver),
                Err(IpcError::ServerNotFound) => std::thread::sleep(Duration::from_secs(1)),

                Err(error) => {
                    eprintln!("IPC Sender connect error: {}", error);
                    break;
                }
            }
        }

        eprintln!("IPC Sender thread exited!");
    }

    fn handle_send(connection: &mut IpcSender, receiver: &Receiver<Message>) {
        while let Ok(message) = receiver.recv() {
            if let Err(error) = connection.send(&message) {
                eprintln!("IPC Send error: {}", error);
                break;
            }
        }
    }

    fn receiver_thread(sender: Sender<IpcEvent>) {
        let mut ipc_receiver = IpcReceiver::new();

        loop {
            match ipc_receiver.connect() {
                Ok(_) => {
                    // TODO Reader cannot detect disconnects
                    sender.send(IpcEvent::Connected).unwrap();
                    Self::handle_receive(&mut ipc_receiver, &sender);
                    sender.send(IpcEvent::Disconnected).unwrap();
                }
                Err(IpcError::ServerNotFound) => std::thread::sleep(Duration::from_secs(1)),
                Err(error) => {
                    eprintln!("IPC Receiver connect error: {}", error);
                    break;
                }
            }
        }

        eprintln!("IPC Receiver thread exited!");
    }

    fn handle_receive(connection: &mut IpcReceiver, sender: &Sender<IpcEvent>) {
        loop {
            match connection.read_message() {
                Ok(message) => sender.send(IpcEvent::Message(message)).unwrap(),
                Err(error) => {
                    eprintln!("IPC Read Error: {}", error);
                    break;
                }
            }
        }
    }
}

trait IpcConnection {
    fn connect(&mut self) -> Result<(), IpcError>;
}

fn open_pipe<P: AsRef<Path>>(path: P, is_recv: bool) -> Result<File, IpcError> {
    match OpenOptions::new().read(is_recv).write(!is_recv).open(path) {
        Ok(file) => Ok(file),
        Err(error) => {
            if error.kind() == std::io::ErrorKind::NotFound {
                return Err(IpcError::ServerNotFound);
            }
            Err(IpcError::IoError(error))
        }
    }
}

#[derive(thiserror::Error)]
pub enum IpcError {
    #[error("IPC server not found")]
    ServerNotFound,
    #[error("IPC service not connected")]
    NotConnected,
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("JSON Error: {0}")]
    JsonError(#[from] json::Error),
}

impl std::fmt::Debug for IpcError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(std::format_args!("{}", self))
    }
}
