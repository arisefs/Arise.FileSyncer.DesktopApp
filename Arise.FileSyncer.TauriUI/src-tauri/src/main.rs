#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod appstate;
mod ipc;
mod messages;
mod models;

use appstate::AppState;
use ipc::{IpcEvent, IpcService};
use messages::{
    DeleteProfileMessage, EditProfileMessage, Message, NewProfileMessage,
    ReceivedProfileResultMessage, SendProfileMessage, SetAllowPairingMessage,
};
use serde::{Deserialize, Serialize};
use std::error::Error;
use tauri::Window;

static GLOBAL: state::Storage<AppState> = state::Storage::new();

fn main() {
    // Setup global state first
    GLOBAL.set(AppState::new(IpcService::new()));

    // Start Tauri
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            window_ready,
            set_allow_pairing,
            profile_new_request,
            accept_profile,
            delete_profile,
            share_profile,
            edit_profile
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct LoadActivity {
    widget_name: String,
    props: ActivityProps,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct ActivityProps {
    lost_connection: bool,
}

#[tauri::command]
async fn window_ready(window: Window) {
    println!("Webview is ready");
    println!("Loading activity 'IpcStatusActivity'");
    load_activity(&window, "IpcStatusActivity", false);

    let state = GLOBAL.get();
    if !state.active().get() {
        let active = state.active().clone();
        let receiver = state.service().receiver.clone();
        let sender = state.service().sender.clone();

        std::thread::spawn(move || {
            loop {
                match receiver.recv().unwrap() {
                    IpcEvent::Message(message) => {
                        if let Err(error) = handle_message(&window, message) {
                            eprintln!("Window handle message error: {}", error);
                            break;
                        }
                    }
                    IpcEvent::Connected => {
                        println!("IPC Connected!");
                        sender.send(Message::Welcome).unwrap();
                    }
                    IpcEvent::Disconnected => {
                        println!("IPC Disconnected!");
                        load_activity(&window, "IpcStatusActivity", true);
                    }
                }
            }

            active.set(false);
        });

        state.active().set(true);
    } else {
        state.service().sender.send(Message::Welcome).unwrap();
    }
}

fn load_activity(window: &Window, activity: &str, disconnected: bool) {
    if let Err(error) = window.emit(
        "window-load-activity",
        LoadActivity {
            widget_name: activity.to_string(),
            props: ActivityProps {
                lost_connection: disconnected,
            },
        },
    ) {
        eprintln!("Tauri emit error: {}", error);
    }
}

fn handle_message(window: &Window, message: Message) -> Result<(), Box<dyn Error>> {
    match message {
        Message::Update(_) => window.emit("srvUpdate", message)?,
        Message::Initialization(_) => window.emit("srvInitialization", message)?,
        Message::ConnectionAdded(_) => window.emit("srvConnectionAdded", message)?,
        Message::ConnectionRemoved(_) => window.emit("srvConnectionRemoved", message)?,
        Message::ConnectionVerified(_) => window.emit("srvConnectionVerified", message)?,
        Message::NewProfileResult(_) => window.emit("srvNewProfileResult", message)?,
        Message::EditProfileResult(_) => window.emit("srvEditProfileResult", message)?,
        Message::DeleteProfileResult(_) => window.emit("srvDeleteProfileResult", message)?,
        Message::ProfileAdded(_) => window.emit("srvProfileAdded", message)?,
        Message::ProfileChanged(_) => window.emit("srvProfileChanged", message)?,
        Message::ProfileRemoved(_) => window.emit("srvProfileRemoved", message)?,
        Message::ReceivedProfile(_) => window.emit("srvReceivedProfile", message)?,
        _ => eprintln!("Received unknown message!"),
    }
    Ok(())
}

#[tauri::command]
async fn set_allow_pairing(new_pairing_state: bool) {
    let message = Message::SetAllowPairing(SetAllowPairingMessage {
        allow_pairing: new_pairing_state,
    });
    send_message(message);
}

#[tauri::command]
async fn profile_new_request(profile_data: NewProfileMessage) {
    let message = Message::NewProfile(profile_data);
    send_message(message);
}

#[tauri::command]
async fn accept_profile(result_data: ReceivedProfileResultMessage) {
    let message = Message::ReceivedProfileResult(result_data);
    send_message(message);
}

#[tauri::command]
async fn delete_profile(profile_id: String) {
    let message = Message::DeleteProfile(DeleteProfileMessage { profile_id });
    send_message(message);
}

#[tauri::command]
async fn share_profile(share_data: SendProfileMessage) {
    let message = Message::SendProfile(share_data);
    send_message(message);
}

#[tauri::command]
async fn edit_profile(profile_data: EditProfileMessage) {
    let message = Message::EditProfile(profile_data);
    send_message(message);
}

fn send_message(message: Message) {
    GLOBAL
        .get()
        .service()
        .sender
        .send(message)
        .expect("Failed to send the message to the service");
}
