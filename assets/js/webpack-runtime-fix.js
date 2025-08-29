// Advanced Webpack Runtime Fix - Intercepts publicPath setting directly
// This script must load BEFORE webpack.runtime.min.js

(function() {
    'use strict';
    
    console.log('[Advanced Webpack Fix] Initializing runtime interception...');
    
    // Store original methods before webpack loads
    const originalDefineProperty = Object.defineProperty;
    const originalGetElementsByTagName = document.getElementsByTagName;
    
    // Flag to track if we've already fixed webpack
    let webpackFixed = false;
    
    // Calculate correct relative path based on current location
    function getCorrectPath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        console.log('[Advanced Webpack Fix] Current protocol:', protocol);
        console.log('[Advanced Webpack Fix] Current pathname:', pathname);
        
        if (protocol === 'file:') {
            // For file:// protocol, determine depth
            const pathParts = pathname.split('/');
            let depth = 0;
            
            // Find the project root or HTML file depth
            for (let i = pathParts.length - 1; i >= 0; i--) {
                if (pathParts[i].endsWith('.html')) {
                    depth = pathParts.length - i - 1;
                    break;
                }
            }
            
            // For root level files
            if (depth === 0) {
                return 'wp-content/plugins/elementor/assets/js/';
            } else {
                let relativePath = '';
                for (let j = 0; j < depth; j++) {
                    relativePath += '../';
                }
                return relativePath + 'wp-content/plugins/elementor/assets/js/';
            }
        } else {
            // For HTTP/HTTPS, calculate relative path
            const segments = pathname.split('/').filter(s => s);
            
            // Remove filename if present
            if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
                segments.pop();
            }
            
            let relativePath = '';
            for (let i = 0; i < segments.length; i++) {
                relativePath += '../';
            }
            return relativePath + 'wp-content/plugins/elementor/assets/js/';
        }
    }
    
    // Override Object.defineProperty to catch webpack publicPath setting
    Object.defineProperty = function(obj, prop, descriptor) {
        // Validate arguments before proceeding
        if (typeof obj !== 'object' || obj === null) {
            console.warn('[Advanced Webpack Fix] Invalid object passed to defineProperty:', obj);
            return originalDefineProperty.call(this, obj, prop, descriptor);
        }
        
        if (prop === '__esModule' || prop === 'p') {
            console.log('[Advanced Webpack Fix] Intercepted property definition:', prop);
        }
        
        try {
            return originalDefineProperty.call(this, obj, prop, descriptor);
        } catch (error) {
            console.warn('[Advanced Webpack Fix] defineProperty failed:', error.message);
            return obj;
        }
    };
    
    // Override getElementsByTagName to intercept script detection
    document.getElementsByTagName = function(tagName) {
        const elements = originalGetElementsByTagName.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script' && !webpackFixed) {
            console.log('[Advanced Webpack Fix] Script elements requested, checking for webpack...');
            
            // Check if this is webpack trying to determine publicPath
            const stack = new Error().stack;
            if (stack && stack.includes('webpack') || stack.includes('__webpack_require__')) {
                console.log('[Advanced Webpack Fix] Webpack script detection intercepted');
            }
        }
        
        return elements;
    };
    
    // Monitor for webpack global variable
    let webpackCheckInterval;
    
    function checkAndFixWebpack() {
        if (typeof window.__webpack_require__ !== 'undefined' && window.__webpack_require__.p) {
            const currentPath = window.__webpack_require__.p;
            console.log('[Advanced Webpack Fix] Found webpack publicPath:', currentPath);
            
            if (currentPath.startsWith('file://') || currentPath.includes('/Users/') || currentPath.includes('/home/') || currentPath.includes('C:\\')) {
                const correctPath = getCorrectPath();
                window.__webpack_require__.p = correctPath;
                
                console.log('[Advanced Webpack Fix] ✅ Fixed webpack publicPath from:', currentPath);
                console.log('[Advanced Webpack Fix] ✅ Fixed webpack publicPath to:', correctPath);
                
                webpackFixed = true;
                if (webpackCheckInterval) clearInterval(webpackCheckInterval);
                return true;
            }
        }
        
        // Also check for elementor webpack
        if (typeof window.elementorFrontend !== 'undefined' && window.elementorFrontend.config) {
            console.log('[Advanced Webpack Fix] Elementor frontend detected');
        }
        
        return false;
    }
    
    // Start monitoring immediately
    webpackCheckInterval = setInterval(checkAndFixWebpack, 50);
    
    // Also check on various events
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndFixWebpack);
    }
    
    window.addEventListener('load', function() {
        setTimeout(checkAndFixWebpack, 100);
        setTimeout(checkAndFixWebpack, 500);
        setTimeout(checkAndFixWebpack, 1000);
    });
    
    // Override webpack's publicPath detection by monkey-patching
    const originalCurrentScript = Object.getOwnPropertyDescriptor(Document.prototype, 'currentScript') || 
                                 Object.getOwnPropertyDescriptor(document, 'currentScript');
    
    if (originalCurrentScript && typeof document === 'object') {
        try {
            Object.defineProperty(document, 'currentScript', {
                get: function() {
                    const script = originalCurrentScript.get ? originalCurrentScript.get.call(this) : this._currentScript;
                    
                    if (script && script.src && (script.src.startsWith('file://') || script.src.includes('/Users/'))) {
                        console.log('[Advanced Webpack Fix] Intercepted currentScript.src:', script.src);
                        
                        // Return a modified script object
                        return new Proxy(script, {
                            get: function(target, prop) {
                                if (prop === 'src') {
                                    const correctPath = getCorrectPath();
                                    const fakeSrc = window.location.protocol + '//' + (window.location.host || 'localhost') + '/' + correctPath.replace(/\/$/, '') + '/webpack.runtime.min.js';
                                    console.log('[Advanced Webpack Fix] Returning fake src:', fakeSrc);
                                    return fakeSrc;
                                }
                                return target[prop];
                            }
                        });
                    }
                    
                    return script;
                },
                configurable: true
            });
        } catch (error) {
            console.warn('[Advanced Webpack Fix] Could not override currentScript:', error.message);
        }
    }
    
    // Clear monitoring after reasonable time
    setTimeout(() => {
        if (webpackCheckInterval) {
            clearInterval(webpackCheckInterval);
            console.log('[Advanced Webpack Fix] Stopped monitoring after 10 seconds');
        }
        
        // Restore original methods
        Object.defineProperty = originalDefineProperty;
        document.getElementsByTagName = originalGetElementsByTagName;
        
    }, 10000);
    
    console.log('[Advanced Webpack Fix] Runtime interception initialized');
    
})();
