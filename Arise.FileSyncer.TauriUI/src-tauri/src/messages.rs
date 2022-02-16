use crate::models::*;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "Command")]
pub enum Message {
    Welcome,
    Update(UpdateMessage),
    Initialization(InitializationMessage),
    SetAllowPairing(SetAllowPairingMessage),
    ConnectionAdded(ConnectionEventMessage),
    ConnectionRemoved(ConnectionEventMessage),
    ConnectionVerified(ConnectionVerifiedMessage),
    NewProfile(NewProfileMessage),
    NewProfileResult(ProfileResultMessage),
    EditProfile(EditProfileMessage),
    EditProfileResult(ProfileResultMessage),
    DeleteProfile(DeleteProfileMessage),
    DeleteProfileResult(ProfileResultMessage),
    ProfileAdded(ProfileEventMessage),
    ProfileChanged(ProfileEventMessage),
    ProfileRemoved(ProfileEventMessage),
    ReceivedProfile(ReceivedProfileMessage),
    ReceivedProfileResult(ReceivedProfileResultMessage),
    SendProfile(SendProfileMessage),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct UpdateMessage {
    pub is_syncing: bool,
    pub progresses: Vec<ConnectionProgress>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct InitializationMessage {
    pub display_name: String,
    pub profiles: Vec<ProfileData>,
    pub connections: Vec<ConnectionData>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct SetAllowPairingMessage {
    pub allow_pairing: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ConnectionEventMessage {
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ConnectionVerifiedMessage {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct NewProfileMessage {
    pub display_name: String,
    pub root_directory: PathBuf,
    pub allow_send: bool,
    pub allow_receive: bool,
    pub allow_delete: bool,
    pub skip_hidden: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct EditProfileMessage {
    pub id: String,
    pub name: String,
    pub root_directory: PathBuf,
    pub allow_send: bool,
    pub allow_receive: bool,
    pub allow_delete: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct DeleteProfileMessage {
    pub profile_id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ProfileResultMessage {
    pub success: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ProfileEventMessage {
    pub profile: ProfileData,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ReceivedProfileMessage {
    pub connection_id: String,
    pub id: String,
    pub key: String,
    pub name: String,
    pub creation_date: String,
    pub skip_hidden: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ReceivedProfileResultMessage {
    pub connection_id: String,
    pub id: String,
    pub key: String,
    pub name: String,
    pub root_directory: PathBuf,
    pub creation_date: String,
    pub allow_send: bool,
    pub allow_receive: bool,
    pub allow_delete: bool,
    pub skip_hidden: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct SendProfileMessage {
    pub connection_id: String,
    pub profile_id: String,
}
