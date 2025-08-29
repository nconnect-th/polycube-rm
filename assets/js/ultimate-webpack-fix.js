// Ultimate Webpack Fix - Unified solution for all chunk loading issues
// This replaces all other webpack fixes with one comprehensive solution

(function() {
    'use strict';
    
    console.log('[Ultimate Webpack Fix] Initializing unified webpack solution...');
    
    // Prevent multiple initialization
    if (window.ultimateWebpackFixLoaded) {
        console.log('[Ultimate Webpack Fix] Already loaded, skipping...');
        return;
    }
    window.ultimateWebpackFixLoaded = true;
    
    // Complete mapping of all Elementor chunks
    const CHUNK_MAPPINGS = {
        212: 'text-editor.c084ef86600b6f11690d.bundle.min.js',
        177: 'image-carousel.6167d20b95b33386757b.bundle.min.js',
        180: 'video.6ebfa2c3f5493cb2eaaf.bundle.min.js',
        131: 'accordion.36aa4c8c4eba17bc8e03.bundle.min.js',
        575: 'tabs.537e7a0f178447960143.bundle.min.js',
        707: 'alert.42cc1d522ef5c60bf874.bundle.min.js',
        457: 'counter.12335f45aaa79d244f24.bundle.min.js',
        234: 'progress.3200f67fe8fb78924bea.bundle.min.js',
        775: 'toggle.a6177e2e3c2bc8864bef.bundle.min.js'
    };
    
    // State management
    const loadedChunks = new Set();
    const failedChunks = new Set();
    let webpackReady = false;
    
    // Calculate the correct base path for Elementor assets
    function calculateBasePath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        if (protocol === 'file:') {
            // File protocol - calculate relative path
            const parts = pathname.split('/');
            let depth = 0;
            
            // Find HTML file to calculate depth
            for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i].endsWith('.html')) {
                    depth = parts.length - i - 1;
                    break;
                }
            }
            
            let relative = '';
            for (let j = 0; j < depth; j++) {
                relative += '../';
            }
            return relative + 'wp-content/plugins/elementor/assets/js/';
        } else {
            // HTTP protocol - handle subdirectories
            const segments = pathname.split('/').filter(s => s);
            if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
                segments.pop(); // Remove filename
            }
            
            let relative = '';
            for (let i = 0; i < segments.length; i++) {
                relative += '../';
            }
            return relative + 'wp-content/plugins/elementor/assets/js/';
        }
    }
    
    // Load a chunk with proper error handling
    function loadChunk(chunkId) {
        const chunkKey = String(chunkId);
        
        if (loadedChunks.has(chunkKey)) {
            console.log('[Ultimate Webpack Fix] Chunk', chunkId, 'already loaded');
            return Promise.resolve();
        }
        
        if (failedChunks.has(chunkKey)) {
            console.log('[Ultimate Webpack Fix] Chunk', chunkId, 'previously failed');
            return Promise.reject(new Error(`Chunk ${chunkId} failed to load`));
        }
        
        const filename = CHUNK_MAPPINGS[chunkKey];
        if (!filename) {
            console.warn('[Ultimate Webpack Fix] No mapping for chunk:', chunkId);
            return Promise.reject(new Error(`No mapping for chunk ${chunkId}`));
        }
        
        const basePath = calculateBasePath();
        const fullPath = basePath + filename;
        
        console.log('[Ultimate Webpack Fix] Loading chunk', chunkId, 'from:', fullPath);
        
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${fullPath}"]`);
            if (existingScript) {
                console.log('[Ultimate Webpack Fix] Script already exists for chunk:', chunkId);
                loadedChunks.add(chunkKey);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = fullPath;
            script.charset = 'utf-8';
            script.async = true;
            script.timeout = 30000;
            script.setAttribute('data-chunk-id', chunkKey);
            
            let timeoutId = setTimeout(() => {
                console.error('[Ultimate Webpack Fix] Timeout loading chunk:', chunkId);
                cleanup();
                failedChunks.add(chunkKey);
                reject(new Error(`Timeout loading chunk ${chunkId}`));
            }, 30000);
            
            function cleanup() {
                clearTimeout(timeoutId);
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            }
            
            script.onload = function() {
                console.log('[Ultimate Webpack Fix] ✅ Successfully loaded chunk:', chunkId);
                loadedChunks.add(chunkKey);
                cleanup();
                resolve();
            };
            
            script.onerror = function(error) {
                console.error('[Ultimate Webpack Fix] ❌ Failed to load chunk:', chunkId, error);
                failedChunks.add(chunkKey);
                cleanup();
                reject(new Error(`Failed to load chunk ${chunkId}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Fix webpack public path
    function fixWebpackPublicPath() {
        if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.p) {
            const currentPath = __webpack_require__.p;
            
            // Check if path needs fixing
            if (currentPath.includes('file:') || 
                currentPath.includes('/Users/') || 
                currentPath.includes('/home/') ||
                currentPath.includes('C:\\')) {
                
                const correctPath = calculateBasePath();
                __webpack_require__.p = correctPath;
                console.log('[Ultimate Webpack Fix] Fixed publicPath:', currentPath, '->', correctPath);
                return true;
            }
        }
        return false;
    }
    
    // Replace webpack chunk loader
    function interceptWebpackLoader() {
        if (typeof __webpack_require__ === 'undefined' || !__webpack_require__.e) {
            return false;
        }
        
        const originalLoader = __webpack_require__.e;
        
        __webpack_require__.e = function(chunkId) {
            console.log('[Ultimate Webpack Fix] Intercepted chunk request:', chunkId);
            
            // Always fix public path before loading
            fixWebpackPublicPath();
            
            // Special handling for chunk 212 (text-editor)
            if (chunkId === 212 || chunkId === '212' || String(chunkId) === '212') {
                console.log('[Ultimate Webpack Fix] Special handling for chunk 212');
                
                // Check if already loaded by chunk212 fix
                if (window.textEditorPreloaded || window.chunk212FixLoaded) {
                    console.log('[Ultimate Webpack Fix] Chunk 212 already handled by specific fix');
                    return Promise.resolve();
                }
                
                // Use custom loader for chunk 212
                return loadChunk(chunkId);
            }
            
            // Use custom loader for mapped chunks
            if (CHUNK_MAPPINGS[String(chunkId)]) {
                console.log('[Ultimate Webpack Fix] Using custom loader for chunk:', chunkId);
                return loadChunk(chunkId);
            }
            
            // Use original loader with error handling
            return originalLoader.apply(this, arguments).catch(error => {
                console.error('[Ultimate Webpack Fix] Original loader failed:', error);
                
                // Try custom loader as fallback for chunk 212
                if (chunkId === 212 || chunkId === '212' || String(chunkId) === '212') {
                    console.log('[Ultimate Webpack Fix] Emergency fallback for chunk 212');
                    return loadChunk(chunkId);
                }
                
                // Try custom loader as fallback for other mapped chunks
                if (CHUNK_MAPPINGS[String(chunkId)]) {
                    console.log('[Ultimate Webpack Fix] Trying custom fallback for chunk:', chunkId);
                    return loadChunk(chunkId);
                }
                
                throw error;
            });
        };
        
        console.log('[Ultimate Webpack Fix] ✅ Webpack loader intercepted');
        return true;
    }
    
    // Initialize the fix
    function initialize() {
        console.log('[Ultimate Webpack Fix] Initializing...');
        
        if (typeof __webpack_require__ !== 'undefined') {
            console.log('[Ultimate Webpack Fix] Webpack detected immediately');
            fixWebpackPublicPath();
            interceptWebpackLoader();
            webpackReady = true;
        } else {
            console.log('[Ultimate Webpack Fix] Waiting for webpack...');
            
            // Monitor for webpack
            let attempts = 0;
            const monitor = setInterval(() => {
                attempts++;
                
                if (typeof __webpack_require__ !== 'undefined') {
                    console.log('[Ultimate Webpack Fix] Webpack detected after', attempts, 'attempts');
                    clearInterval(monitor);
                    
                    fixWebpackPublicPath();
                    interceptWebpackLoader();
                    webpackReady = true;
                    
                } else if (attempts >= 100) {
                    console.log('[Ultimate Webpack Fix] Webpack not found after 100 attempts');
                    clearInterval(monitor);
                }
            }, 100);
        }
    }
    
    // Global error handlers for chunk loading errors
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('ChunkLoadError')) {
            console.log('[Ultimate Webpack Fix] Caught ChunkLoadError:', event.message);
            event.preventDefault();
            
            // Extract chunk ID from error
            const chunkMatch = event.message.match(/chunk (\d+)/);
            if (chunkMatch) {
                const chunkId = chunkMatch[1];
                console.log('[Ultimate Webpack Fix] Attempting emergency load for chunk:', chunkId);
                
                // Special handling for chunk 212
                if (chunkId === '212') {
                    console.log('[Ultimate Webpack Fix] Delegating chunk 212 to specific fix');
                    if (window.chunk212Debug && window.chunk212Debug.forceReload) {
                        window.chunk212Debug.forceReload().catch(error => {
                            console.error('[Ultimate Webpack Fix] Chunk 212 emergency load failed:', error);
                        });
                    }
                    return;
                }
                
                loadChunk(chunkId).catch(error => {
                    console.error('[Ultimate Webpack Fix] Emergency load failed:', error);
                });
            }
        }
    }, true);

    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            event.reason.message.includes('ChunkLoadError')) {
            console.log('[Ultimate Webpack Fix] Caught unhandled chunk rejection');
            event.preventDefault();
            
            const chunkMatch = event.reason.message.match(/chunk (\d+)/);
            if (chunkMatch) {
                const chunkId = chunkMatch[1];
                
                // Special handling for chunk 212
                if (chunkId === '212') {
                    console.log('[Ultimate Webpack Fix] Delegating chunk 212 rejection to specific fix');
                    if (window.chunk212Debug && window.chunk212Debug.forceReload) {
                        window.chunk212Debug.forceReload().catch(error => {
                            console.error('[Ultimate Webpack Fix] Chunk 212 rejection recovery failed:', error);
                        });
                    }
                    return;
                }
                
                loadChunk(chunkId).catch(error => {
                    console.error('[Ultimate Webpack Fix] Rejection recovery failed:', error);
                });
            }
        }
    }, true);    // Expose debug functions
    window.webpackFixDebug = {
        loadChunk: loadChunk,
        loadedChunks: () => Array.from(loadedChunks),
        failedChunks: () => Array.from(failedChunks),
        isReady: () => webpackReady,
        basePath: calculateBasePath
    };
    
    // Initialize immediately
    initialize();
    
    // Also initialize on DOM ready as fallback
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    
    console.log('[Ultimate Webpack Fix] ✅ Unified webpack fix loaded successfully');
    
})();
