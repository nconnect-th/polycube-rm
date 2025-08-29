// Comprehensive Webpack Chunk Fix - Master fix for all chunk loading issues
// This is the final comprehensive solution for webpack chunk loading problems

(function() {
    'use strict';
    
    console.log('[Comprehensive Webpack Fix] Initializing master chunk loading fix...');
    
    // Complete chunk mapping for all known Elementor chunks
    const chunkMap = {
        // Text editor chunks
        212: ['text-editor.c084ef86600b6f11690d.bundle.min.js', 'text-editor.bd4eccbd156d0b1fc3cf.bundle.js'],
        
        // Other common Elementor chunks
        177: ['image-carousel.6167d20b95b33386757b.bundle.min.js', 'image-carousel.1a3e0c6222562304eed5.bundle.js'],
        180: ['video.6ebfa2c3f5493cb2eaaf.bundle.min.js', 'video.d862fafddbe5d05459f3.bundle.js'],
        131: ['accordion.36aa4c8c4eba17bc8e03.bundle.min.js', 'accordion.7b5b5744bdd225280eca.bundle.js'],
        575: ['tabs.537e7a0f178447960143.bundle.min.js', 'tabs.e808857358793ac13db5.bundle.js'],
        707: ['alert.42cc1d522ef5c60bf874.bundle.min.js', 'alert.b696182ec6f18a35bc69.bundle.js'],
        457: ['counter.12335f45aaa79d244f24.bundle.min.js', 'counter.f359dee9199f5aad06c6.bundle.js'],
        234: ['progress.3200f67fe8fb78924bea.bundle.min.js', 'progress.5d8492a023e85c6cc0e0.bundle.js'],
        775: ['toggle.a6177e2e3c2bc8864bef.bundle.min.js', 'toggle.375da8e2f6fed12731c2.bundle.js'],
        211: ['wp-audio.c9624cb6e5dc9de86abd.bundle.min.js', 'wp-audio.c91cab3152c3f241f266.bundle.js'],
        215: ['nested-tabs.1fde581754604147f6d7.bundle.min.js', 'nested-tabs.213892f3e7a826d32481.bundle.js'],
        915: ['nested-accordion.c546968f7aebebc356f2.bundle.min.js', 'nested-accordion.a0f28ea648b29da812a1.bundle.js'],
        1: ['contact-buttons.7c9983ed0d4964b951c2.bundle.min.js', 'contact-buttons.c21325756a91b795f8e4.bundle.js'],
        336: ['floating-bars.c1e9838906b386709cd4.bundle.min.js', 'floating-bars.7efeeb8b098e55999ff1.bundle.js'],
        216: ['container.0754914e4611dc659a50.bundle.min.js', 'container.cb1e834c5aad68e9c908.bundle.js'],
        304: ['nested-title-keyboard-handler.fc9d01c2cd0ef46d20fd.bundle.min.js', 'nested-title-keyboard-handler.967db65f6ba460c1f2e9.bundle.js'],
        835: ['lightbox.f3fa607b705962362647.bundle.min.js', 'lightbox.74688eb10c7852662847.bundle.js'],
        30: ['text-path.5923566687faac82ea62.bundle.min.js', 'text-path.acb8842ac7e1cd1dfb44.bundle.js'],
        
        // Onboarding chunks
        501: ['onboarding.cb1850dab52d5cd9ce5b.bundle.min.js', 'onboarding.120a44527e5a7209a8e4.bundle.js'],
        
        // Kit library chunks
        741: ['kit-library.09cb71ec3fbb128f4e25.bundle.min.js', 'kit-library.b0f0ab89c95fe1f6fde3.bundle.js'],
        742: ['kit-library.93bc587768f425638edc.bundle.min.js', 'kit-library.f3e637c5acf9b98d8334.bundle.js'],
        
        // Styleguide chunks
        891: ['styleguide-app.51d4579e75a5f39265bc.bundle.min.js', 'styleguide-app.a6e297c616479b98c03d.bundle.js']
    };
    
    // Loaded chunks tracking
    const loadedChunks = new Set();
    const loadingChunks = new Map();
    
    function calculateElementorBasePath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        console.log('[Comprehensive Webpack Fix] Calculating base path for:', pathname);
        
        if (protocol === 'file:') {
            const pathParts = pathname.split('/');
            let depth = 0;
            
            // Find HTML file depth
            for (let i = pathParts.length - 1; i >= 0; i--) {
                if (pathParts[i].endsWith('.html')) {
                    depth = pathParts.length - i - 1;
                    break;
                }
            }
            
            let relativePath = '';
            for (let j = 0; j < depth; j++) {
                relativePath += '../';
            }
            return relativePath + 'wp-content/plugins/elementor/assets/js/';
        } else {
            const segments = pathname.split('/').filter(s => s);
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
    
    // Load chunk with fallback support
    function loadChunk(chunkId) {
        const chunkKey = String(chunkId);
        
        // Return existing loading promise if chunk is already being loaded
        if (loadingChunks.has(chunkKey)) {
            return loadingChunks.get(chunkKey);
        }
        
        // Return resolved promise if chunk is already loaded
        if (loadedChunks.has(chunkKey)) {
            return Promise.resolve();
        }
        
        console.log('[Comprehensive Webpack Fix] Loading chunk:', chunkId);
        
        const basePath = calculateElementorBasePath();
        const chunkFiles = chunkMap[chunkKey];
        
        if (!chunkFiles) {
            console.warn('[Comprehensive Webpack Fix] No mapping found for chunk:', chunkId);
            return Promise.reject(new Error(`No mapping for chunk ${chunkId}`));
        }
        
        // Try loading files in order (minified first, then fallback)
        function tryLoadFile(index) {
            if (index >= chunkFiles.length) {
                console.error('[Comprehensive Webpack Fix] All files failed for chunk:', chunkId);
                loadingChunks.delete(chunkKey);
                return Promise.reject(new Error(`All files failed for chunk ${chunkId}`));
            }
            
            const filename = chunkFiles[index];
            const fullPath = basePath + filename;
            
            console.log('[Comprehensive Webpack Fix] Trying to load:', fullPath);
            
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = fullPath;
                script.charset = 'utf-8';
                script.timeout = 30000;
                script.async = true;
                
                script.onload = function() {
                    console.log('[Comprehensive Webpack Fix] ✅ Successfully loaded:', filename);
                    loadedChunks.add(chunkKey);
                    loadingChunks.delete(chunkKey);
                    document.head.removeChild(script);
                    resolve();
                };
                
                script.onerror = function() {
                    console.warn('[Comprehensive Webpack Fix] Failed to load:', filename, 'trying next...');
                    document.head.removeChild(script);
                    // Try next file
                    tryLoadFile(index + 1).then(resolve).catch(reject);
                };
                
                document.head.appendChild(script);
            });
        }
        
        const loadPromise = tryLoadFile(0);
        loadingChunks.set(chunkKey, loadPromise);
        return loadPromise;
    }
    
    // Replace webpack's chunk loading system
    function interceptWebpackChunkLoader() {
        if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.e) {
            const originalLoader = __webpack_require__.e;
            
            __webpack_require__.e = function(chunkId) {
                console.log('[Comprehensive Webpack Fix] Intercepted chunk request:', chunkId);
                
                // Check if we have a mapping for this chunk
                if (chunkMap[String(chunkId)]) {
                    console.log('[Comprehensive Webpack Fix] Using custom loader for chunk:', chunkId);
                    return loadChunk(chunkId);
                }
                
                // Use original loader with fallback
                return originalLoader.apply(this, arguments).catch(error => {
                    console.warn('[Comprehensive Webpack Fix] Original loader failed for chunk:', chunkId, error.message);
                    
                    // Try custom loader as fallback
                    if (chunkMap[String(chunkId)]) {
                        console.log('[Comprehensive Webpack Fix] Attempting custom fallback for chunk:', chunkId);
                        return loadChunk(chunkId);
                    }
                    
                    throw error;
                });
            };
            
            // Also fix publicPath if it's wrong
            if (__webpack_require__.p && (__webpack_require__.p.startsWith('file://') || 
                __webpack_require__.p.includes('/Users/') || __webpack_require__.p.includes('/home/'))) {
                const correctPath = calculateElementorBasePath();
                console.log('[Comprehensive Webpack Fix] Fixing webpack publicPath from:', __webpack_require__.p);
                console.log('[Comprehensive Webpack Fix] Fixing webpack publicPath to:', correctPath);
                __webpack_require__.p = correctPath;
            }
            
            console.log('[Comprehensive Webpack Fix] Webpack chunk loader intercepted successfully');
            return true;
        }
        return false;
    }
    
    // Monitor for webpack and apply fix
    let attempts = 0;
    const maxAttempts = 50;
    
    const monitor = setInterval(() => {
        attempts++;
        
        if (interceptWebpackChunkLoader()) {
            console.log('[Comprehensive Webpack Fix] ✅ Master fix activated successfully');
            clearInterval(monitor);
        } else if (attempts >= maxAttempts) {
            console.log('[Comprehensive Webpack Fix] Webpack not found, creating fallback environment');
            clearInterval(monitor);
            
            // Create fallback webpack environment
            if (typeof __webpack_require__ === 'undefined') {
                window.__webpack_require__ = {
                    e: loadChunk,
                    p: calculateElementorBasePath(),
                    O: () => Promise.resolve(),
                    d: () => {},
                    r: () => {},
                    u: (chunkId) => chunkMap[String(chunkId)] ? chunkMap[String(chunkId)][0] : 'unknown.js'
                };
                console.log('[Comprehensive Webpack Fix] Fallback webpack environment created');
            }
        }
    }, 200);
    
    // Global error handlers
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('ChunkLoadError')) {
            console.log('[Comprehensive Webpack Fix] ChunkLoadError detected:', event.message);
            event.preventDefault();
            
            // Extract chunk ID from error message
            const chunkMatch = event.message.match(/chunk (\d+)/);
            if (chunkMatch) {
                const chunkId = chunkMatch[1];
                console.log('[Comprehensive Webpack Fix] Attempting manual load for chunk:', chunkId);
                loadChunk(chunkId).catch(error => {
                    console.error('[Comprehensive Webpack Fix] Manual load failed:', error);
                });
            }
        }
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && event.reason.message.includes('ChunkLoadError')) {
            console.log('[Comprehensive Webpack Fix] Unhandled chunk load rejection:', event.reason.message);
            event.preventDefault();
            
            const chunkMatch = event.reason.message.match(/chunk (\d+)/);
            if (chunkMatch) {
                const chunkId = chunkMatch[1];
                console.log('[Comprehensive Webpack Fix] Attempting manual load for chunk:', chunkId);
                loadChunk(chunkId).catch(error => {
                    console.error('[Comprehensive Webpack Fix] Manual load failed:', error);
                });
            }
        }
    });
    
    console.log('[Comprehensive Webpack Fix] Master chunk loading system initialized');
    
})();
