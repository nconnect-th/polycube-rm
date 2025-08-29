// Specific Chunk 212 Fix and Test
// This script is designed to specifically fix and test chunk 212 (text-editor)

(function() {
    'use strict';
    
    console.log('[Chunk 212 Fix] Starting specific fix for text-editor chunk...');
    
    // Force fix publicPath immediately
    function forceFixPublicPath() {
        if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.p) {
            const currentPath = __webpack_require__.p;
            console.log('[Chunk 212 Fix] Current publicPath:', currentPath);
            
            // Check if path needs fixing
            if (currentPath.includes('file:') || 
                currentPath.includes('/Users/') ||
                currentPath.includes('/home/') ||
                currentPath.includes('C:\\')) {
                
                // Force correct path
                __webpack_require__.p = 'wp-content/plugins/elementor/assets/js/';
                console.log('[Chunk 212 Fix] ✅ Fixed publicPath to:', __webpack_require__.p);
                return true;
            }
        }
        return false;
    }
    
    // Override chunk loader specifically for chunk 212
    function overrideChunk212Loader() {
        if (typeof __webpack_require__ === 'undefined' || !__webpack_require__.f || !__webpack_require__.f.j) {
            return false;
        }
        
        // Store original loader
        const originalChunkLoader = __webpack_require__.f.j;
        
        // Create enhanced loader
        __webpack_require__.f.j = function(chunkId, promises) {
            console.log('[Chunk 212 Fix] Chunk loading request:', chunkId);
            
            // Ensure publicPath is correct before any chunk loading
            forceFixPublicPath();
            
            // Special handling for chunk 212
            if (chunkId === 212) {
                console.log('[Chunk 212 Fix] Intercepting chunk 212 loading...');
                
                // Create custom promise for chunk 212
                const chunk212Promise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'wp-content/plugins/elementor/assets/js/text-editor.c084ef86600b6f11690d.bundle.min.js';
                    script.charset = 'utf-8';
                    script.async = true;
                    
                    script.onload = function() {
                        console.log('[Chunk 212 Fix] ✅ Chunk 212 loaded successfully via custom loader');
                        document.head.removeChild(script);
                        resolve();
                    };
                    
                    script.onerror = function(error) {
                        console.error('[Chunk 212 Fix] ❌ Chunk 212 custom loading failed:', error);
                        document.head.removeChild(script);
                        reject(new Error('Chunk 212 loading failed'));
                    };
                    
                    document.head.appendChild(script);
                });
                
                promises.push(chunk212Promise);
                return;
            }
            
            // Use original loader for other chunks
            return originalChunkLoader.call(this, chunkId, promises);
        };
        
        console.log('[Chunk 212 Fix] ✅ Chunk loader overridden for chunk 212');
        return true;
    }
    
    // Test chunk 212 loading
    function testChunk212() {
        if (typeof __webpack_require__ === 'undefined' || !__webpack_require__.e) {
            console.error('[Chunk 212 Fix] Cannot test - webpack not ready');
            return;
        }
        
        console.log('[Chunk 212 Fix] Testing chunk 212 loading...');
        
        const startTime = Date.now();
        
        __webpack_require__.e(212)
            .then(() => {
                const loadTime = Date.now() - startTime;
                console.log(`[Chunk 212 Fix] ✅ SUCCESS! Chunk 212 loaded in ${loadTime}ms`);
                
                // Test module access
                try {
                    const module = __webpack_require__(212);
                    console.log('[Chunk 212 Fix] ✅ Module 212 accessed successfully:', module);
                    
                    if (module && module.default) {
                        const component = module.default();
                        console.log('[Chunk 212 Fix] ✅ TextEditor component created:', component);
                        
                        if (component && typeof component.init === 'function') {
                            component.init();
                            console.log('[Chunk 212 Fix] ✅ TextEditor component initialized successfully');
                        }
                    }
                } catch (error) {
                    console.error('[Chunk 212 Fix] ❌ Module access error:', error);
                }
            })
            .catch((error) => {
                const loadTime = Date.now() - startTime;
                console.error(`[Chunk 212 Fix] ❌ FAILED! Chunk 212 loading failed after ${loadTime}ms:`, error);
                
                if (error.message && error.message.includes('Loading chunk 212 failed')) {
                    console.error('[Chunk 212 Fix] This is the exact error we are trying to fix!');
                    console.error('[Chunk 212 Fix] Error details:', {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    });
                }
            });
    }
    
    // Initialize fix
    function initialize() {
        console.log('[Chunk 212 Fix] Initializing...');
        
        // Try immediate fix
        if (typeof __webpack_require__ !== 'undefined') {
            console.log('[Chunk 212 Fix] Webpack already available');
            forceFixPublicPath();
            overrideChunk212Loader();
            
            // Test after a short delay
            setTimeout(() => {
                testChunk212();
            }, 500);
        } else {
            console.log('[Chunk 212 Fix] Waiting for webpack...');
            
            // Monitor for webpack
            let attempts = 0;
            const monitor = setInterval(() => {
                attempts++;
                
                if (typeof __webpack_require__ !== 'undefined') {
                    console.log('[Chunk 212 Fix] Webpack detected after', attempts, 'attempts');
                    clearInterval(monitor);
                    
                    forceFixPublicPath();
                    overrideChunk212Loader();
                    
                    setTimeout(() => {
                        testChunk212();
                    }, 500);
                } else if (attempts >= 50) {
                    console.error('[Chunk 212 Fix] Webpack not detected after 50 attempts');
                    clearInterval(monitor);
                }
            }, 100);
        }
    }
    
    // Global error handler specifically for chunk 212
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('Loading chunk 212 failed')) {
            console.log('[Chunk 212 Fix] Caught ChunkLoadError for chunk 212, attempting recovery...');
            event.preventDefault();
            
            // Manual recovery attempt
            const script = document.createElement('script');
            script.src = 'wp-content/plugins/elementor/assets/js/text-editor.c084ef86600b6f11690d.bundle.min.js';
            script.onload = function() {
                console.log('[Chunk 212 Fix] ✅ Emergency recovery successful');
                document.head.removeChild(script);
            };
            script.onerror = function() {
                console.error('[Chunk 212 Fix] ❌ Emergency recovery failed');
                document.head.removeChild(script);
            };
            document.head.appendChild(script);
        }
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            event.reason.message.includes('Loading chunk 212 failed')) {
            console.log('[Chunk 212 Fix] Caught promise rejection for chunk 212');
            event.preventDefault();
        }
    });
    
    // Start immediately
    initialize();
    
    // Also start on DOM ready as fallback
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    
    console.log('[Chunk 212 Fix] Chunk 212 fix script loaded');
    
})();
