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
        
        // Set black background for safe areas
        window.backgroundColor = UIColor.black
        rootViewController.view.backgroundColor = UIColor.black
        
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
            
            // Set black background for safe areas
            rootViewController.view.backgroundColor = UIColor.black
            window.backgroundColor = UIColor.black
            
            // Find the WKWebView in the view hierarchy
            if let webView = self.findWebView(in: rootViewController.view) {
                self.configureWebView(webView, in: rootViewController.view)
                invoke.resolve(["success": true, "message": "Safe area constraints applied"])
            } else {
                invoke.reject("WKWebView not found in view hierarchy")
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
}

@_cdecl("init_plugin_safe_area")
func initPlugin() -> Plugin {
    return SafeAreaPlugin()
}