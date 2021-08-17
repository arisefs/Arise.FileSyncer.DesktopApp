#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod ipc;
mod messages;
mod models;

use ipc::{IpcEvent, IpcService};
use messages::{
    DeleteProfileMessage, EditProfileMessage, Message, NewProfileMessage,
    ReceivedProfileResultMessage, SendProfileMessage, SetAllowPairingMessage,
};
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

struct MyState {
    ipc_service: IpcService,
    is_active: Arc<AtomicBool>,
}

fn main() {
    let ipc_service = IpcService::new();

    tauri::Builder::default()
        .manage(MyState {
            ipc_service,
            is_active: Arc::new(AtomicBool::new(false)),
        })
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
        .expect("error while running tauri application");
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct LoadActivity {
    widget_name: String,
    props: ActivityProps,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct ActivityProps {
    lost_connection: bool,
}

#[tauri::command]
fn window_ready(window: tauri::Window, state: tauri::State<MyState>) {
    println!("Window JS is ready! Loading activity 'IpcStatusActivity'.");
    load_activity(&window, "IpcStatusActivity", false);

    if !state.is_active.load(Ordering::SeqCst) {
        let is_active_clone = state.is_active.clone();
        let receiver = state.ipc_service.receiver.clone();
        let sender = state.ipc_service.sender.clone();

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

            is_active_clone.store(false, Ordering::SeqCst);
        });

        state.is_active.store(true, Ordering::SeqCst);
    } else {
        state.ipc_service.sender.send(Message::Welcome).unwrap();
    }
}

fn load_activity(window: &tauri::Window, activity: &str, lost_connection: bool) {
    if let Err(error) = window.emit(
        "window-load-activity",
        LoadActivity {
            widget_name: activity.to_string(),
            props: ActivityProps { lost_connection },
        },
    ) {
        eprintln!("Tauri emit error: {}", error);
    }
}

fn handle_message(window: &tauri::Window, message: Message) -> Result<(), Box<dyn Error>> {
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
fn set_allow_pairing(state: tauri::State<MyState>, new_pairing_state: bool) {
    let message = Message::SetAllowPairing(SetAllowPairingMessage {
        allow_pairing: new_pairing_state,
    });
    state.ipc_service.sender.send(message).unwrap();
}

#[tauri::command]
fn profile_new_request(state: tauri::State<MyState>, profile_data: NewProfileMessage) {
    let message = Message::NewProfile(profile_data);
    state.ipc_service.sender.send(message).unwrap();
}

#[tauri::command]
fn accept_profile(state: tauri::State<MyState>, result_data: ReceivedProfileResultMessage) {
    let message = Message::ReceivedProfileResult(result_data);
    state.ipc_service.sender.send(message).unwrap();
}

#[tauri::command]
fn delete_profile(state: tauri::State<MyState>, profile_id: String) {
    let message = Message::DeleteProfile(DeleteProfileMessage { profile_id });
    state.ipc_service.sender.send(message).unwrap();
}

#[tauri::command]
fn share_profile(state: tauri::State<MyState>, share_data: SendProfileMessage) {
    let message = Message::SendProfile(share_data);
    state.ipc_service.sender.send(message).unwrap();
}

#[tauri::command]
fn edit_profile(state: tauri::State<MyState>, profile_data: EditProfileMessage) {
    let message = Message::EditProfile(profile_data);
    state.ipc_service.sender.send(message).unwrap();
}
