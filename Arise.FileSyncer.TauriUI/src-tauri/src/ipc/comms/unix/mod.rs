mod connection;
mod server;

pub use connection::IpcConnection;
pub use server::IpcServer;
pub type IpcClient = IpcConnection;

pub const ADDR: &str = r"/tmp/autosyncer-service.sock";

#[cfg(test)]
pub const TEST_ADDR: &str = r"/tmp/autosyncer-ipc-test.sock";
