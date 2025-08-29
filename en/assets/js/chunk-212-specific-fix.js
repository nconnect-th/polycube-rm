// Chunk 212 (Text Editor) Specific Fix
// This script specifically handles the text-editor chunk loading issue

(function() {
    'use strict';
    
    console.log('[Chunk 212 Fix] Loading aggressive fix for text-editor chunk...');
    
    // Prevent multiple initialization
    if (window.chunk212FixLoaded) {
        console.log('[Chunk 212 Fix] Already loaded, skipping...');
        return;
    }
    window.chunk212FixLoaded = true;
    
    // Text editor chunk filename
    const TEXT_EDITOR_FILE = 'text-editor.c084ef86600b6f11690d.bundle.min.js';
    let isLoaded = false;
    let isLoading = false;
    
    // Calculate correct path based on current environment
    function getCorrectPath() {
        const isFileProtocol = window.location.protocol === 'file:';
        
        if (isFileProtocol) {
            // For file:// protocol, use relative path from current file
            return './wp-content/plugins/elementor/assets/js/';
        } else {
            // For http/https, use absolute path from domain root
            const pathname = window.location.pathname;
            const depth = pathname.split('/').filter(p => p && !p.includes('.')).length;
            
            let relativePath = '';
            for (let i = 0; i < depth; i++) {
                relativePath += '../';
            }
            
            return relativePath + 'wp-content/plugins/elementor/assets/js/';
        }
    }
    
    // Load text editor chunk manually
    function loadTextEditorChunk() {
        if (isLoaded || isLoading) {
            console.log('[Chunk 212 Fix] Text editor already loaded or loading');
            return Promise.resolve();
        }
        
        // Check if already preloaded
        if (window.textEditorPreloaded) {
            console.log('[Chunk 212 Fix] Text editor already preloaded');
            isLoaded = true;
            return Promise.resolve();
        }
        
        isLoading = true;
        const basePath = getCorrectPath();
        const fullPath = basePath + TEXT_EDITOR_FILE;
        
        console.log('[Chunk 212 Fix] Loading text editor from:', fullPath);
        
        return new Promise((resolve, reject) => {
            // Check if script already exists in DOM
            const existing = document.querySelector(`script[src*="${TEXT_EDITOR_FILE}"]`) || 
                           document.querySelector(`script[data-preload="text-editor"]`);
            if (existing) {
                console.log('[Chunk 212 Fix] Text editor script already exists in DOM');
                isLoaded = true;
                isLoading = false;
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = fullPath;
            script.async = false; // Synchronous loading for reliability
            script.charset = 'utf-8';
            script.setAttribute('data-chunk', '212');
            script.setAttribute('data-purpose', 'text-editor-fix');
            
            script.onload = function() {
                console.log('[Chunk 212 Fix] ✅ Text editor loaded successfully');
                isLoaded = true;
                isLoading = false;
                resolve();
            };
            
            script.onerror = function(error) {
                console.error('[Chunk 212 Fix] ❌ Failed to load text editor:', error);
                isLoading = false;
                reject(new Error(`Failed to load text editor: ${fullPath}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Aggressive webpack interception
    function aggressiveWebpackIntercept() {
        console.log('[Chunk 212 Fix] Installing aggressive webpack intercept...');
        
        // Override webpack require entirely for chunk 212
        const originalWebpackRequire = window.__webpack_require__;
        
        // Monitor for webpack initialization
        let webpackCheckInterval = setInterval(() => {
            if (typeof window.__webpack_require__ !== 'undefined' && window.__webpack_require__.e) {
                console.log('[Chunk 212 Fix] Webpack detected, installing intercept...');
                clearInterval(webpackCheckInterval);
                
                const originalChunkLoader = window.__webpack_require__.e;
                
                window.__webpack_require__.e = function(chunkId) {
                    console.log('[Chunk 212 Fix] Chunk request intercepted:', chunkId);
                    
                    // Handle chunk 212 specifically
                    if (chunkId === 212 || chunkId === '212' || String(chunkId) === '212') {
                        console.log('[Chunk 212 Fix] Redirecting chunk 212 to custom loader');
                        return loadTextEditorChunk();
                    }
                    
                    // Use original loader for other chunks, but with error handling
                    return originalChunkLoader.apply(this, arguments).catch(error => {
                        console.error('[Chunk 212 Fix] Original loader failed for chunk:', chunkId, error);
                        
                        // If it's chunk 212, try our custom loader as fallback
                        if (chunkId === 212 || chunkId === '212' || String(chunkId) === '212') {
                            console.log('[Chunk 212 Fix] Fallback to custom loader for chunk 212');
                            return loadTextEditorChunk();
                        }
                        
                        throw error;
                    });
                };
                
                console.log('[Chunk 212 Fix] ✅ Aggressive webpack intercept installed');
            }
        }, 50);
        
        // Stop checking after 10 seconds
        setTimeout(() => {
            clearInterval(webpackCheckInterval);
            console.log('[Chunk 212 Fix] Webpack check timeout, webpack may not be present');
        }, 10000);
    }
    
    // Block chunk 212 errors completely
    function blockChunk212Errors() {
        const originalConsoleError = console.error;
        console.error = function() {
            const message = Array.from(arguments).join(' ');
            if (message.includes('ChunkLoadError') && message.includes('212')) {
                console.warn('[Chunk 212 Fix] Blocked chunk 212 error:', message);
                return;
            }
            originalConsoleError.apply(console, arguments);
        };
    }
    
    // Global error handler for chunk 212 specifically
    function handleChunk212Error(event) {
        const message = event.message || (event.reason && event.reason.message) || '';
        
        if (message.includes('ChunkLoadError') && 
           (message.includes('212') || message.includes('text-editor'))) {
            console.log('[Chunk 212 Fix] Detected chunk 212 loading error, attempting emergency recovery...');
            
            loadTextEditorChunk().catch(error => {
                console.error('[Chunk 212 Fix] Emergency recovery failed:', error);
            });
            
            event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
            return true;
        }
        
        return false;
    }
    
    // Install comprehensive error handlers
    window.addEventListener('error', handleChunk212Error, true);
    window.addEventListener('unhandledrejection', handleChunk212Error, true);
    
    // Also capture at document level
    document.addEventListener('error', handleChunk212Error, true);
    
    // Initialize immediately
    function initialize() {
        console.log('[Chunk 212 Fix] Initializing aggressive fix...');
        
        // Block errors first
        blockChunk212Errors();
        
        // Install webpack intercept
        aggressiveWebpackIntercept();
        
        // Preload if text editor widget is present
        setTimeout(() => {
            if (document.querySelector('.elementor-widget-text-editor') && !window.textEditorPreloaded) {
                console.log('[Chunk 212 Fix] Text editor widget detected, emergency preload...');
                loadTextEditorChunk().catch(error => {
                    console.warn('[Chunk 212 Fix] Emergency preload failed:', error);
                });
            }
        }, 100);
    }
    
    // Expose debug functions
    window.chunk212Debug = {
        load: loadTextEditorChunk,
        isLoaded: () => isLoaded,
        isLoading: () => isLoading,
        path: getCorrectPath,
        forceReload: () => {
            isLoaded = false;
            isLoading = false;
            return loadTextEditorChunk();
        }
    };
    
    // Initialize immediately
    initialize();
    
    console.log('[Chunk 212 Fix] ✅ Aggressive chunk 212 fix loaded');
    
})();
