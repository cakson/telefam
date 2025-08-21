// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "tauri-plugin-safe-area",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "tauri-plugin-safe-area",
            type: .static,
            targets: ["tauri-plugin-safe-area"])
    ],
    dependencies: [
        .package(name: "Tauri", path: "../.tauri/tauri-api")
    ],
    targets: [
        .target(
            name: "tauri-plugin-safe-area",
            dependencies: ["Tauri"],
            path: "Sources")
    ]
)