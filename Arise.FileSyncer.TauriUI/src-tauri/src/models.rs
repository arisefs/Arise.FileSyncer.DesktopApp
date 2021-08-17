use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct ConnectionProgress {
    pub id: String,
    pub indeterminate: bool,
    pub current: i64,
    pub maximum: i64,
    pub speed: f64,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct ConnectionData {
    pub id: String,
    pub verified: bool,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct ProfileData {
    pub id: String,
    pub name: String,
    pub activated: bool,
    pub allow_send: bool,
    pub allow_receive: bool,
    pub allow_delete: bool,
    pub creation_date: DateTime<Utc>,
    pub last_sync_date: DateTime<Utc>,
    pub root_directory: PathBuf,
    pub skip_hidden: bool,
}
