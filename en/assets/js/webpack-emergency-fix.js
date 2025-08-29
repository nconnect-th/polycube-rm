// Emergency Webpack Replacement - Last resort fix
// This completely replaces webpack's chunk loading system if all else fails

(function() {
    'use strict';
    
    console.log('[Emergency Webpack Fix] Initializing emergency replacement system...');
    
    // Emergency chunk mapping
    const emergencyChunkMap = {
        212: 'text-editor.c084ef86600b6f11690d.bundle.min.js',
        177: 'image-carousel.6167d20b95b33386757b.bundle.min.js',
        180: 'video.6ebfa2c3f5493cb2eaaf.bundle.min.js',
        131: 'accordion.36aa4c8c4eba17bc8e03.bundle.min.js',
        575: 'tabs.537e7a0f178447960143.bundle.min.js',
        707: 'alert.42cc1d522ef5c60bf874.bundle.min.js',
        457: 'counter.12335f45aaa79d244f24.bundle.min.js',
        234: 'progress.3200f67fe8fb78924bea.bundle.min.js',
        775: 'toggle.a6177e2e3c2bc8864bef.bundle.min.js',
        211: 'wp-audio.c9624cb6e5dc9de86abd.bundle.min.js',
        215: 'nested-tabs.1fde581754604147f6d7.bundle.min.js',
        915: 'nested-accordion.c546968f7aebebc356f2.bundle.min.js',
        1: 'contact-buttons.7c9983ed0d4964b951c2.bundle.min.js',
        336: 'floating-bars.c1e9838906b386709cd4.bundle.min.js',
        216: 'container.0754914e4611dc659a50.bundle.min.js',
        304: 'nested-title-keyboard-handler.fc9d01c2cd0ef46d20fd.bundle.min.js',
        835: 'lightbox.f3fa607b705962362647.bundle.min.js',
        30: 'text-path.5923566687faac82ea62.bundle.min.js'
    };
    
    function calculateBasePath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        if (protocol === 'file:') {
            const pathParts = pathname.split('/');
            let depth = 0;
            
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
    
    // Emergency chunk loader
    function emergencyLoadChunk(chunkId) {
        console.log('[Emergency Webpack Fix] Emergency loading chunk:', chunkId);
        
        const basePath = calculateBasePath();
        const filename = emergencyChunkMap[chunkId];
        
        if (!filename) {
            console.warn('[Emergency Webpack Fix] No mapping found for chunk:', chunkId);
            return Promise.reject(new Error(`No mapping for chunk ${chunkId}`));
        }
        
        const fullPath = basePath + filename;
        console.log('[Emergency Webpack Fix] Loading from:', fullPath);
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = fullPath;
            script.charset = 'utf-8';
            script.timeout = 120000;
            
            script.onload = function() {
                console.log('[Emergency Webpack Fix] Successfully loaded chunk:', chunkId);
                resolve();
            };
            
            script.onerror = function() {
                console.error('[Emergency Webpack Fix] Failed to load chunk:', chunkId, 'from', fullPath);
                reject(new Error(`Loading chunk ${chunkId} failed`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Replace webpack's chunk loading system if it's broken
    function replaceWebpackChunkLoader() {
        if (typeof __webpack_require__ !== 'undefined') {
            const originalLoader = __webpack_require__.e;
            
            __webpack_require__.e = function(chunkId) {
                console.log('[Emergency Webpack Fix] Intercepting chunk load request:', chunkId);
                
                // Try original loader first
                return originalLoader.call(this, chunkId).catch(error => {
                    console.warn('[Emergency Webpack Fix] Original loader failed:', error.message);
                    console.log('[Emergency Webpack Fix] Attempting emergency load...');
                    
                    // Try emergency loader
                    return emergencyLoadChunk(chunkId);
                });
            };
            
            console.log('[Emergency Webpack Fix] Webpack chunk loader replaced');
            return true;
        }
        return false;
    }
    
    // Monitor for webpack and replace when found
    let attempts = 0;
    const maxAttempts = 100;
    
    const checkWebpack = setInterval(() => {
        attempts++;
        
        if (replaceWebpackChunkLoader()) {
            console.log('[Emergency Webpack Fix] Emergency system activated after', attempts * 100, 'ms');
            clearInterval(checkWebpack);
        } else if (attempts >= maxAttempts) {
            console.log('[Emergency Webpack Fix] Webpack not found, emergency system on standby');
            clearInterval(checkWebpack);
            
            // Create a minimal webpack environment
            if (typeof __webpack_require__ === 'undefined') {
                console.log('[Emergency Webpack Fix] Creating minimal webpack environment...');
                
                window.__webpack_require__ = {
                    e: emergencyLoadChunk,
                    p: calculateBasePath(),
                    O: function() { return Promise.resolve(); },
                    d: function() {},
                    r: function() {},
                    u: function(chunkId) { return emergencyChunkMap[chunkId] || 'unknown.js'; }
                };
            }
        }
    }, 100);
    
    // Also check on load events
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (!replaceWebpackChunkLoader()) {
                console.log('[Emergency Webpack Fix] Post-load check: webpack still not found');
            }
        }, 500);
    });
    
    console.log('[Emergency Webpack Fix] Emergency system initialized');
    
})();
