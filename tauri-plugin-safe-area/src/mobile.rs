use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_safe_area);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<SafeArea<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("", "ExamplePlugin")?;
  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_safe_area)?;
  Ok(SafeArea(handle))
}

/// Access to the safe-area APIs.
pub struct SafeArea<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> SafeArea<R> {
  pub fn apply_constraints(&self) -> crate::Result<serde_json::Value> {
    self
      .0
      .run_mobile_plugin("applyConstraints", ())
      .map_err(Into::into)
  }

  pub fn get_safe_area_insets(&self) -> crate::Result<SafeAreaInsets> {
    self
      .0
      .run_mobile_plugin("getSafeAreaInsets", ())
      .map_err(Into::into)
  }

  pub fn set_safe_area_color(&self, color: String) -> crate::Result<serde_json::Value> {
    self
      .0
      .run_mobile_plugin("setSafeAreaColor", serde_json::json!({ "color": color }))
      .map_err(Into::into)
  }
}
