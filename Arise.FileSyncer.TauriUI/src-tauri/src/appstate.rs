use crate::ipc::IpcService;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

pub struct AppState {
    service: IpcService,
    active: CrossBool,
}

impl AppState {
    pub fn new(service: IpcService) -> Self {
        Self {
            service,
            active: CrossBool::new(false),
        }
    }

    pub fn service(&self) -> &IpcService {
        &self.service
    }

    pub fn active(&self) -> &CrossBool {
        &self.active
    }
}

#[derive(Debug, Clone)]
pub struct CrossBool {
    inner: Arc<AtomicBool>,
}

impl CrossBool {
    pub fn new(val: bool) -> Self {
        Self {
            inner: Arc::new(AtomicBool::new(val)),
        }
    }

    pub fn get(&self) -> bool {
        self.inner.load(Ordering::SeqCst)
    }

    pub fn set(&self, val: bool) {
        self.inner.store(val, Ordering::SeqCst);
    }
}
