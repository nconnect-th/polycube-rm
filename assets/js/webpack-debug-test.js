// Enhanced Webpack Chunk Debug and Test
// This script specifically tests chunk 212 (text-editor) loading

(function() {
    'use strict';
    
    console.log('[Webpack Debug] Starting enhanced webpack chunk test...');
    
    // Debug function to check webpack state
    function debugWebpackState() {
        console.log('[Webpack Debug] === Webpack State Analysis ===');
        
        if (typeof __webpack_require__ === 'undefined') {
            console.error('[Webpack Debug] ❌ __webpack_require__ not available');
            return false;
        }
        
        console.log('[Webpack Debug] ✅ __webpack_require__ is available');
        
        // Check publicPath
        if (__webpack_require__.p) {
            console.log('[Webpack Debug] Current publicPath:', __webpack_require__.p);
            
            if (__webpack_require__.p.includes('file:') || 
                __webpack_require__.p.includes('/Users/') ||
                __webpack_require__.p.includes('/home/') ||
                __webpack_require__.p.includes('C:\\')) {
                console.warn('[Webpack Debug] ⚠️ PublicPath contains absolute path - this may cause issues');
            } else {
                console.log('[Webpack Debug] ✅ PublicPath looks correct');
            }
        } else {
            console.warn('[Webpack Debug] ⚠️ PublicPath not set');
        }
        
        // Check chunk loader
        if (__webpack_require__.f && __webpack_require__.f.j) {
            console.log('[Webpack Debug] ✅ Chunk loader available');
        } else {
            console.error('[Webpack Debug] ❌ Chunk loader not available');
        }
        
        // Check chunk filename function
        if (__webpack_require__.u) {
            console.log('[Webpack Debug] ✅ Chunk filename function available');
            
            // Test chunk 212 filename resolution
            const chunk212Filename = __webpack_require__.u(212);
            console.log('[Webpack Debug] Chunk 212 filename:', chunk212Filename);
            
            if (chunk212Filename === 'text-editor.c084ef86600b6f11690d.bundle.min.js') {
                console.log('[Webpack Debug] ✅ Chunk 212 filename matches expected');
            } else {
                console.warn('[Webpack Debug] ⚠️ Chunk 212 filename mismatch. Expected: text-editor.c084ef86600b6f11690d.bundle.min.js');
            }
        } else {
            console.error('[Webpack Debug] ❌ Chunk filename function not available');
        }
        
        return true;
    }
    
    // Test chunk 212 loading specifically
    function testChunk212Loading() {
        console.log('[Webpack Debug] === Testing Chunk 212 Loading ===');
        
        if (typeof __webpack_require__ === 'undefined' || !__webpack_require__.e) {
            console.error('[Webpack Debug] ❌ Cannot test chunk loading - webpack not ready');
            return;
        }
        
        console.log('[Webpack Debug] Attempting to load chunk 212...');
        
        const startTime = Date.now();
        
        __webpack_require__.e(212)
            .then(() => {
                const loadTime = Date.now() - startTime;
                console.log(`[Webpack Debug] ✅ Chunk 212 loaded successfully in ${loadTime}ms`);
                
                // Try to access the text-editor module
                try {
                    const textEditorModule = __webpack_require__(212);
                    console.log('[Webpack Debug] ✅ Text-editor module accessed:', textEditorModule);
                    
                    if (textEditorModule && textEditorModule.default) {
                        console.log('[Webpack Debug] ✅ Text-editor component available');
                        
                        // Test the component
                        const component = textEditorModule.default();
                        if (component && typeof component.init === 'function') {
                            console.log('[Webpack Debug] ✅ Text-editor component methods available');
                            component.init();
                        }
                    }
                } catch (error) {
                    console.error('[Webpack Debug] ❌ Error accessing text-editor module:', error);
                }
            })
            .catch((error) => {
                const loadTime = Date.now() - startTime;
                console.error(`[Webpack Debug] ❌ Chunk 212 loading failed after ${loadTime}ms:`, error);
                
                // Detailed error analysis
                if (error.name === 'ChunkLoadError') {
                    console.error('[Webpack Debug] This is a ChunkLoadError - likely a path issue');
                    console.error('[Webpack Debug] Error details:', {
                        message: error.message,
                        type: error.type,
                        request: error.request
                    });
                    
                    // Try to construct the expected URL
                    const expectedUrl = __webpack_require__.p + __webpack_require__.u(212);
                    console.log('[Webpack Debug] Expected URL would be:', expectedUrl);
                }
            });
    }
    
    // Monitor for webpack chunks array
    function monitorWebpackChunks() {
        if (typeof self.webpackChunkelementor !== 'undefined') {
            console.log('[Webpack Debug] ✅ webpackChunkelementor array detected');
            console.log('[Webpack Debug] Current chunks:', self.webpackChunkelementor.length);
            
            // Check if chunk 212 is already loaded
            const chunk212Loaded = self.webpackChunkelementor.some(chunk => {
                return Array.isArray(chunk) && chunk[0] && chunk[0].includes(212);
            });
            
            if (chunk212Loaded) {
                console.log('[Webpack Debug] ✅ Chunk 212 already loaded in webpackChunkelementor');
            } else {
                console.log('[Webpack Debug] ⚠️ Chunk 212 not found in webpackChunkelementor');
            }
        } else {
            console.log('[Webpack Debug] ⚠️ webpackChunkelementor array not yet available');
        }
    }
    
    // Run initial debug
    setTimeout(() => {
        console.log('[Webpack Debug] === Initial Analysis ===');
        monitorWebpackChunks();
        
        if (debugWebpackState()) {
            console.log('[Webpack Debug] === Running Chunk 212 Test ===');
            testChunk212Loading();
        }
    }, 1000);
    
    // Set up continuous monitoring
    let monitorCount = 0;
    const monitor = setInterval(() => {
        monitorCount++;
        
        if (typeof __webpack_require__ !== 'undefined') {
            console.log('[Webpack Debug] Webpack detected, stopping monitor');
            clearInterval(monitor);
            
            setTimeout(() => {
                debugWebpackState();
                testChunk212Loading();
            }, 500);
        } else if (monitorCount >= 30) {
            console.log('[Webpack Debug] Monitor timeout after 30 attempts');
            clearInterval(monitor);
        }
    }, 1000);
    
    console.log('[Webpack Debug] Debug script initialized');
    
})();
