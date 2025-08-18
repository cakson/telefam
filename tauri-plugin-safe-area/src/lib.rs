use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::SafeArea;
#[cfg(mobile)]
use mobile::SafeArea;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the safe-area APIs.
pub trait SafeAreaExt<R: Runtime> {
  fn safe_area(&self) -> &SafeArea<R>;
}

impl<R: Runtime, T: Manager<R>> crate::SafeAreaExt<R> for T {
  fn safe_area(&self) -> &SafeArea<R> {
    self.state::<SafeArea<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  let mut builder = Builder::new("safe-area");
  
  #[cfg(mobile)]
  {
    builder = builder.invoke_handler(tauri::generate_handler![
      commands::ping,
      commands::apply_constraints,
      commands::get_safe_area_insets
    ]);
  }
  
  #[cfg(desktop)]
  {
    builder = builder.invoke_handler(tauri::generate_handler![commands::ping]);
  }
  
  builder
    .setup(|app, api| {
      #[cfg(mobile)]
      let safe_area = mobile::init(app, api)?;
      #[cfg(desktop)]
      let safe_area = desktop::init(app, api)?;
      app.manage(safe_area);
      Ok(())
    })
    .build()
}
