use tauri::{AppHandle, command, Runtime};
use serde::{Deserialize, Serialize};

use crate::models::*;
use crate::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct SetColorRequest {
    pub color: String,
}

#[cfg(mobile)]
#[command]
pub(crate) async fn apply_constraints<R: Runtime>(
    app: AppHandle<R>,
) -> Result<serde_json::Value> {
    #[cfg(mobile)]
    {
        use crate::SafeAreaExt;
        app.safe_area().apply_constraints()
    }
}

#[cfg(mobile)]
#[command]
pub(crate) async fn get_safe_area_insets<R: Runtime>(
    app: AppHandle<R>,
) -> Result<SafeAreaInsets> {
    #[cfg(mobile)]
    {
        use crate::SafeAreaExt;
        app.safe_area().get_safe_area_insets()
    }
}

#[cfg(mobile)]
#[command]
pub(crate) async fn set_safe_area_color<R: Runtime>(
    app: AppHandle<R>,
    color: String,
) -> Result<serde_json::Value> {
    #[cfg(mobile)]
    {
        use crate::SafeAreaExt;
        app.safe_area().set_safe_area_color(color)
    }
}

#[command]
pub(crate) async fn ping<R: Runtime>(
    _app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    Ok(PingResponse { value: payload.value })
}
