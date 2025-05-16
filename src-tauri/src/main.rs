// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
async fn translate(word: String) -> Result<String, String> {
    let url = format!("https://libretranslate.de/translate?q={}&source=en&target=fa", word);
    let response = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let result = response.text().await.map_err(|e| e.to_string())?;
    Ok(result)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![translate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
