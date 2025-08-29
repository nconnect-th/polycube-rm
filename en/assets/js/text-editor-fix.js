// Text Editor Chunk Fix - Specific fix for text-editor chunk loading
// This is a targeted fix for the text-editor.c084ef8….bundle.min.js ChunkLoadError

(function() {
    'use strict';
    
    console.log('[Text Editor Fix] Initializing text-editor chunk fix...');
    
    // Calculate correct path for text-editor files
    function getTextEditorPath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        console.log('[Text Editor Fix] Current path:', pathname);
        
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
    
    // Text editor chunk files
    const textEditorFiles = [
        'text-editor.c084ef86600b6f11690d.bundle.min.js',
        'text-editor.bd4eccbd156d0b1fc3cf.bundle.js'
    ];
    
    // Load text editor chunk
    function loadTextEditorChunk() {
        const basePath = getTextEditorPath();
        
        console.log('[Text Editor Fix] Base path:', basePath);
        
        // Try to load the minified version first, then fallback to unminified
        function tryLoadFile(index) {
            if (index >= textEditorFiles.length) {
                console.error('[Text Editor Fix] All text editor files failed to load');
                return Promise.reject(new Error('Text editor chunk unavailable'));
            }
            
            const filename = textEditorFiles[index];
            const fullPath = basePath + filename;
            
            console.log('[Text Editor Fix] Attempting to load:', fullPath);
            
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = fullPath;
                script.charset = 'utf-8';
                script.timeout = 30000;
                
                script.onload = function() {
                    console.log('[Text Editor Fix] ✅ Successfully loaded:', filename);
                    resolve();
                };
                
                script.onerror = function() {
                    console.warn('[Text Editor Fix] Failed to load:', filename);
                    // Try next file
                    tryLoadFile(index + 1).then(resolve).catch(reject);
                };
                
                document.head.appendChild(script);
            });
        }
        
        return tryLoadFile(0);
    }
    
    // Override webpack's chunk loading for chunk 212 (text-editor)
    function interceptTextEditorChunk() {
        if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.e) {
            const originalLoader = __webpack_require__.e;
            
            __webpack_require__.e = function(chunkId) {
                console.log('[Text Editor Fix] Chunk request intercepted:', chunkId);
                
                // Handle text-editor chunk (212)
                if (chunkId === 212 || chunkId === '212') {
                    console.log('[Text Editor Fix] Text editor chunk requested, using custom loader');
                    return loadTextEditorChunk();
                }
                
                // Use original loader for other chunks
                return originalLoader.apply(this, arguments);
            };
            
            console.log('[Text Editor Fix] Webpack chunk loader intercepted for text-editor');
            return true;
        }
        return false;
    }
    
    // Monitor for webpack availability
    let checkCount = 0;
    const maxChecks = 50;
    
    const webpackMonitor = setInterval(() => {
        checkCount++;
        
        if (interceptTextEditorChunk()) {
            console.log('[Text Editor Fix] Text editor fix activated');
            clearInterval(webpackMonitor);
        } else if (checkCount >= maxChecks) {
            console.log('[Text Editor Fix] Webpack not available, manual text-editor loading ready');
            clearInterval(webpackMonitor);
        }
    }, 200);
    
    // Global error handler for ChunkLoadError
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('ChunkLoadError') && 
            event.message.includes('text-editor')) {
            console.log('[Text Editor Fix] ChunkLoadError detected for text-editor, attempting manual load');
            event.preventDefault();
            
            loadTextEditorChunk().catch(error => {
                console.error('[Text Editor Fix] Manual text-editor load failed:', error);
            });
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            event.reason.message.includes('text-editor')) {
            console.log('[Text Editor Fix] Promise rejection for text-editor chunk, attempting manual load');
            event.preventDefault();
            
            loadTextEditorChunk().catch(error => {
                console.error('[Text Editor Fix] Manual text-editor load failed:', error);
            });
        }
    });
    
    // Preload text-editor if Elementor is detected
    if (typeof elementorFrontend !== 'undefined' || 
        document.querySelector('[class*="elementor"]')) {
        console.log('[Text Editor Fix] Elementor detected, preloading text-editor chunk');
        setTimeout(() => {
            loadTextEditorChunk().catch(error => {
                console.warn('[Text Editor Fix] Preload failed:', error);
            });
        }, 1000);
    }
    
    console.log('[Text Editor Fix] Text editor fix initialized');
    
})();
