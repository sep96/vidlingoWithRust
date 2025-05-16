// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::OpenOptions;
use std::io::Write;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Translation {
    word: String,
    translation: String,
}
#[tauri::command]
async fn translate(word: String) -> Result<String, String> {
    let url = format!("https://libretranslate.de/translate?q={}&source=en&target=fa", word);
    let response = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let result = response.text().await.map_err(|e| e.to_string())?;
    Ok(result)
}

#[tauri::command]
async fn save_translation(word: String, translation: String) -> Result<String, String> {
    let item = Translation { word, translation };
    let json = serde_json::to_string(&item).map_err(|e| e.to_string())?;
    
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("translations.json")
        .map_err(|e| e.to_string())?;

    writeln!(file, "{}", json).map_err(|e| e.to_string())?;
    Ok("Saved".into())
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![translate, save_translation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
