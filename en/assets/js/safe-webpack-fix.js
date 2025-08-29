// Safe Webpack Runtime Fix - Defensive version without Object.defineProperty override
// This version focuses on fixing webpack without breaking other scripts

(function() {
    'use strict';
    
    console.log('[Safe Webpack Fix] Initializing safe webpack fix...');
    
    // Calculate correct relative path based on current location
    function getCorrectPath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        console.log('[Safe Webpack Fix] Current protocol:', protocol);
        console.log('[Safe Webpack Fix] Current pathname:', pathname);
        
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
    
    // Monitor for webpack global variable and fix publicPath
    function checkAndFixWebpack() {
        if (typeof window.__webpack_require__ !== 'undefined') {
            if (window.__webpack_require__.p) {
                const currentPath = window.__webpack_require__.p;
                console.log('[Safe Webpack Fix] Found webpack publicPath:', currentPath);
                
                if (currentPath.startsWith('file://') || 
                    currentPath.includes('/Users/') || 
                    currentPath.includes('/home/') || 
                    currentPath.includes('C:\\')) {
                    const correctPath = getCorrectPath();
                    window.__webpack_require__.p = correctPath;
                    
                    console.log('[Safe Webpack Fix] ✅ Fixed webpack publicPath from:', currentPath);
                    console.log('[Safe Webpack Fix] ✅ Fixed webpack publicPath to:', correctPath);
                    return true;
                }
            }
            
            // Also patch chunk loader if available
            if (window.__webpack_require__.e && typeof window.__webpack_require__.e === 'function') {
                const originalLoader = window.__webpack_require__.e;
                
                window.__webpack_require__.e = function(chunkId) {
                    console.log('[Safe Webpack Fix] Chunk load request:', chunkId);
                    
                    return originalLoader.apply(this, arguments).catch(error => {
                        console.warn('[Safe Webpack Fix] Chunk loading failed:', error.message);
                        
                        // For text-editor chunk specifically
                        if (chunkId === 212 || chunkId === '212') {
                            console.log('[Safe Webpack Fix] Attempting text-editor chunk recovery...');
                            
                            const basePath = getCorrectPath();
                            const filename = 'text-editor.c084ef86600b6f11690d.bundle.min.js';
                            const fullPath = basePath + filename;
                            
                            return new Promise((resolve, reject) => {
                                const script = document.createElement('script');
                                script.src = fullPath;
                                script.charset = 'utf-8';
                                script.timeout = 30000;
                                
                                script.onload = function() {
                                    console.log('[Safe Webpack Fix] ✅ Text-editor chunk loaded successfully');
                                    document.head.removeChild(script);
                                    resolve();
                                };
                                
                                script.onerror = function() {
                                    console.error('[Safe Webpack Fix] ❌ Text-editor chunk loading failed');
                                    document.head.removeChild(script);
                                    reject(error);
                                };
                                
                                document.head.appendChild(script);
                            });
                        }
                        
                        throw error;
                    });
                };
                
                console.log('[Safe Webpack Fix] Chunk loader patched with recovery system');
            }
            
            return true;
        }
        return false;
    }
    
    // Monitor for webpack availability
    let attempts = 0;
    const maxAttempts = 50;
    
    const webpackMonitor = setInterval(() => {
        attempts++;
        
        if (checkAndFixWebpack()) {
            console.log('[Safe Webpack Fix] ✅ Webpack fix applied successfully');
            clearInterval(webpackMonitor);
        } else if (attempts >= maxAttempts) {
            console.log('[Safe Webpack Fix] Webpack not found after', maxAttempts, 'attempts');
            clearInterval(webpackMonitor);
        }
    }, 200);
    
    // Also check on various events
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndFixWebpack);
    }
    
    window.addEventListener('load', function() {
        setTimeout(checkAndFixWebpack, 100);
        setTimeout(checkAndFixWebpack, 500);
        setTimeout(checkAndFixWebpack, 1000);
    });
    
    // Global error handler for ChunkLoadError
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('ChunkLoadError')) {
            console.log('[Safe Webpack Fix] ChunkLoadError detected:', event.message);
            event.preventDefault();
            
            // Try to extract chunk ID and attempt recovery
            const chunkMatch = event.message.match(/chunk (\d+)/);
            if (chunkMatch && chunkMatch[1] === '212') {
                console.log('[Safe Webpack Fix] Attempting text-editor recovery...');
                
                const basePath = getCorrectPath();
                const filename = 'text-editor.c084ef86600b6f11690d.bundle.min.js';
                const fullPath = basePath + filename;
                
                const script = document.createElement('script');
                script.src = fullPath;
                script.charset = 'utf-8';
                
                script.onload = function() {
                    console.log('[Safe Webpack Fix] ✅ Text-editor recovery successful');
                    document.head.removeChild(script);
                };
                
                script.onerror = function() {
                    console.error('[Safe Webpack Fix] ❌ Text-editor recovery failed');
                    document.head.removeChild(script);
                };
                
                document.head.appendChild(script);
            }
        }
    });
    
    // Handle Promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            event.reason.message.includes('ChunkLoadError')) {
            console.log('[Safe Webpack Fix] Promise rejection for chunk loading');
            event.preventDefault();
        }
    });
    
    console.log('[Safe Webpack Fix] Safe webpack fix initialized');
    
})();
