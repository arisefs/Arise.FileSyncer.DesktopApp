mod client;
mod connection;
mod server;

pub use client::IpcClient;
pub use connection::IpcConnection;
pub use server::IpcServer;

pub const ADDR: &str = r"\\.\pipe\autosyncer-service";

#[cfg(test)]
pub const TEST_ADDR: &str = r"\\.\pipe\autosyncer-ipc-test";
