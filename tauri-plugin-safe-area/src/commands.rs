use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;

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

#[command]
pub(crate) async fn ping<R: Runtime>(
    _app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    Ok(PingResponse { value: payload.value })
}
