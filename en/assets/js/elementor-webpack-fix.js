// Elementor Webpack PublicPath Fix - Ultimate solution for chunk loading
// This script fixes the publicPath issue that causes ChunkLoadError in Elementor

(function() {
    'use strict';
    
    console.log('[Elementor Webpack Fix] Starting comprehensive chunk loading fix...');
    
    // Fix webpack publicPath before any chunks are loaded
    function fixWebpackPublicPath() {
        if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.p) {
            const currentPath = __webpack_require__.p;
            console.log('[Elementor Webpack Fix] Current publicPath:', currentPath);
            
            // Check if we're using file:// protocol or absolute path
            if (currentPath.includes('file:') || currentPath.includes('/Users/') || 
                currentPath.includes('/home/') || currentPath.includes('C:\\')) {
                
                // Calculate correct relative path
                const correctPath = 'wp-content/plugins/elementor/assets/js/';
                __webpack_require__.p = correctPath;
                
                console.log('[Elementor Webpack Fix] ✅ Fixed publicPath to:', correctPath);
                return true;
            }
        }
        return false;
    }
    
    // Enhanced chunk loader with fallback
    function enhanceChunkLoader() {
        if (typeof __webpack_require__ === 'undefined' || !__webpack_require__.f || !__webpack_require__.f.j) {
            return false;
        }
        
        // Store original chunk loader
        const originalLoader = __webpack_require__.f.j;
        
        // Override chunk loader with fallback mechanism
        __webpack_require__.f.j = function(chunkId, promises) {
            console.log('[Elementor Webpack Fix] Chunk load request:', chunkId);
            
            // Ensure correct publicPath before loading
            fixWebpackPublicPath();
            
            // Call original loader
            originalLoader.call(this, chunkId, promises);
            
            // Add fallback for failed chunks
            const lastPromise = promises[promises.length - 1];
            if (lastPromise && typeof lastPromise.catch === 'function') {
                promises[promises.length - 1] = lastPromise.catch(error => {
                    console.warn('[Elementor Webpack Fix] Chunk', chunkId, 'failed, attempting recovery:', error.message);
                    
                    // Specific handling for text-editor chunk (212)
                    if (chunkId === 212) {
                        return loadTextEditorManually();
                    }
                    
                    // For other chunks, try to load manually
                    return loadChunkManually(chunkId);
                });
            }
        };
        
        console.log('[Elementor Webpack Fix] ✅ Chunk loader enhanced with fallback');
        return true;
    }
    
    // Manual text-editor chunk loader
    function loadTextEditorManually() {
        console.log('[Elementor Webpack Fix] Loading text-editor chunk manually...');
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'wp-content/plugins/elementor/assets/js/text-editor.c084ef86600b6f11690d.bundle.min.js';
            script.charset = 'utf-8';
            script.async = true;
            
            script.onload = function() {
                console.log('[Elementor Webpack Fix] ✅ Text-editor chunk loaded manually');
                resolve();
            };
            
            script.onerror = function() {
                console.error('[Elementor Webpack Fix] ❌ Manual text-editor loading failed');
                reject(new Error('Text-editor chunk unavailable'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Generic manual chunk loader
    function loadChunkManually(chunkId) {
        console.log('[Elementor Webpack Fix] Attempting manual load for chunk:', chunkId);
        
        // Known chunk filename mapping
        const chunkFiles = {
            212: 'text-editor.c084ef86600b6f11690d.bundle.min.js',
            177: 'image-carousel.6167d20b95b33386757b.bundle.min.js',
            180: 'video.6ebfa2c3f5493cb2eaaf.bundle.min.js',
            131: 'accordion.36aa4c8c4eba17bc8e03.bundle.min.js',
            575: 'tabs.537e7a0f178447960143.bundle.min.js',
            707: 'alert.42cc1d522ef5c60bf874.bundle.min.js',
            835: 'lightbox.f3fa607b705962362647.bundle.min.js'
        };
        
        const filename = chunkFiles[chunkId];
        if (!filename) {
            console.warn('[Elementor Webpack Fix] Unknown chunk ID:', chunkId);
            return Promise.reject(new Error('Unknown chunk: ' + chunkId));
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'wp-content/plugins/elementor/assets/js/' + filename;
            script.charset = 'utf-8';
            script.async = true;
            
            script.onload = function() {
                console.log('[Elementor Webpack Fix] ✅ Chunk', chunkId, 'loaded manually');
                resolve();
            };
            
            script.onerror = function() {
                console.error('[Elementor Webpack Fix] ❌ Manual loading failed for chunk:', chunkId);
                reject(new Error('Chunk loading failed: ' + chunkId));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Global error prevention
    function setupErrorPrevention() {
        // Prevent ChunkLoadError from breaking the page
        window.addEventListener('error', function(event) {
            if (event.message && event.message.includes('ChunkLoadError')) {
                console.log('[Elementor Webpack Fix] Prevented ChunkLoadError from breaking page');
                event.preventDefault();
                return true;
            }
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            if (event.reason && event.reason.name === 'ChunkLoadError') {
                console.log('[Elementor Webpack Fix] Handled chunk loading promise rejection');
                event.preventDefault();
            }
        });
        
        console.log('[Elementor Webpack Fix] ✅ Error prevention setup complete');
    }
    
    // Initialize fix
    function initialize() {
        setupErrorPrevention();
        
        // Try to fix immediately if webpack is available
        if (typeof __webpack_require__ !== 'undefined') {
            fixWebpackPublicPath();
            enhanceChunkLoader();
        } else {
            // Monitor for webpack availability
            let attempts = 0;
            const monitor = setInterval(() => {
                attempts++;
                
                if (typeof __webpack_require__ !== 'undefined') {
                    fixWebpackPublicPath();
                    enhanceChunkLoader();
                    clearInterval(monitor);
                    console.log('[Elementor Webpack Fix] ✅ Webpack detected and fixed after', attempts, 'attempts');
                } else if (attempts >= 50) {
                    clearInterval(monitor);
                    console.log('[Elementor Webpack Fix] Webpack not detected after 50 attempts');
                }
            }, 100);
        }
    }
    
    // Start immediately
    initialize();
    
    // Also initialize on various events as fallback
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    
    window.addEventListener('load', function() {
        setTimeout(initialize, 100);
    });
    
    console.log('[Elementor Webpack Fix] Initialization complete');
    
})();
