import UIKit
import WebKit
import Tauri

class SafeAreaPlugin: Plugin {
    
    override init() {
        super.init()
        print("SafeAreaPlugin: Initialized")
        
        // Try to apply constraints immediately when plugin is initialized
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.autoApplyConstraints()
        }
    }
    
    private func autoApplyConstraints() {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first,
              let rootViewController = window.rootViewController else {
            return
        }
        
        // Set default white background for safe areas (will be updated by JS)
        window.backgroundColor = UIColor.white
        rootViewController.view.backgroundColor = UIColor.white
        
        // Try to find and configure WKWebView
        if let webView = self.findWebView(in: rootViewController.view) {
            self.configureWebView(webView, in: rootViewController.view)
        } else {
            // Retry after a delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                if let webView = self.findWebView(in: rootViewController.view) {
                    self.configureWebView(webView, in: rootViewController.view)
                }
            }
        }
    }
    
    private func configureWebView(_ webView: WKWebView, in containerView: UIView) {
        // Remove all existing constraints for the webView
        webView.removeFromSuperview()
        containerView.addSubview(webView)
        
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        // Make webView transparent to see background
        webView.isOpaque = false
        webView.backgroundColor = UIColor.clear
        webView.scrollView.backgroundColor = UIColor.clear
        
        // Apply safe area constraints
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: containerView.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: containerView.safeAreaLayoutGuide.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: containerView.safeAreaLayoutGuide.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: containerView.safeAreaLayoutGuide.trailingAnchor)
        ])
        
        print("SafeAreaPlugin: Constraints applied successfully")
    }
    @objc public func applyConstraints(_ invoke: Invoke) {
        DispatchQueue.main.async {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let window = windowScene.windows.first,
                  let rootViewController = window.rootViewController else {
                invoke.reject("Could not find root view controller")
                return
            }
            
            // Set default white background for safe areas (will be updated by JS)
            rootViewController.view.backgroundColor = UIColor.white
            window.backgroundColor = UIColor.white
            
            // Find the WKWebView in the view hierarchy
            if let webView = self.findWebView(in: rootViewController.view) {
                self.configureWebView(webView, in: rootViewController.view)
                invoke.resolve(["success": true, "message": "Safe area constraints applied"])
            } else {
                invoke.reject("WKWebView not found in view hierarchy")
            }
        }
    }
    
    @objc public func setSafeAreaColor(_ invoke: Invoke) {
        DispatchQueue.main.async {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let window = windowScene.windows.first,
                  let rootViewController = window.rootViewController else {
                invoke.reject("Could not find root view controller")
                return
            }
            
            do {
                let args = try invoke.parseArgs([String: String].self)
                guard let colorHex = args["color"] else {
                    invoke.reject("Invalid arguments: color is required")
                    return
                }
                
                let color = self.hexStringToUIColor(hex: colorHex)
                
                // Set the color for safe areas
                rootViewController.view.backgroundColor = color
                window.backgroundColor = color
                
                invoke.resolve(["success": true, "color": colorHex])
            } catch {
                invoke.reject("Failed to parse arguments: \(error.localizedDescription)")
            }
        }
    }
    
    @objc public func getSafeAreaInsets(_ invoke: Invoke) {
        DispatchQueue.main.async {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let window = windowScene.windows.first else {
                invoke.reject("Could not find window")
                return
            }
            
            let insets = window.safeAreaInsets
            invoke.resolve([
                "top": insets.top,
                "bottom": insets.bottom,
                "left": insets.left,
                "right": insets.right
            ])
        }
    }
    
    private func findWebView(in view: UIView) -> WKWebView? {
        if let webView = view as? WKWebView {
            return webView
        }
        
        for subview in view.subviews {
            if let webView = findWebView(in: subview) {
                return webView
            }
        }
        
        return nil
    }
    
    private func hexStringToUIColor(hex: String) -> UIColor {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexString = hexString.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&rgb)
        
        let red = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
        let blue = CGFloat(rgb & 0x0000FF) / 255.0
        
        return UIColor(red: red, green: green, blue: blue, alpha: 1.0)
    }
}

@_cdecl("init_plugin_safe_area")
func initPlugin() -> Plugin {
    return SafeAreaPlugin()
}