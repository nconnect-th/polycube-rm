// Secondary Webpack PublicPath Fix - Works with webpack-runtime-fix.js
// This is a backup system in case the runtime fix doesn't catch everything

(function() {
    'use strict';
    
    console.log('[Secondary Webpack Fix] Starting secondary publicPath fix...');
    
    function calculateRelativePath() {
        const currentPath = window.location.pathname;
        const isFile = window.location.protocol === 'file:';
        
        console.log('[Secondary Webpack Fix] Protocol:', window.location.protocol);
        console.log('[Secondary Webpack Fix] Pathname:', currentPath);
        
        // For file:// protocol (local files)
        if (isFile) {
            const pathParts = currentPath.split('/');
            const htmlIndex = pathParts.findIndex(part => part.endsWith('.html'));
            let depth = 0;
            
            if (htmlIndex > 0) {
                // Count directories from project root
                const projectIndex = pathParts.findIndex(part => part === 'PolycubeWeb2025');
                if (projectIndex >= 0) {
                    depth = htmlIndex - projectIndex - 1;
                }
            }
            
            let relativePath = '';
            for (let i = 0; i < depth; i++) {
                relativePath += '../';
            }
            return relativePath + 'wp-content/plugins/elementor/assets/js/';
        }
        
        // For HTTP/HTTPS (GitHub Pages, other hosting)
        else {
            const pathSegments = currentPath.split('/').filter(segment => segment);
            // Remove filename if present
            if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.html')) {
                pathSegments.pop();
            }
            
            let relativePath = '';
            for (let i = 0; i < pathSegments.length; i++) {
                relativePath += '../';
            }
            return relativePath + 'wp-content/plugins/elementor/assets/js/';
        }
    }
    
    function attemptWebpackFix() {
        // Check all possible webpack instances
        const webpackInstances = [
            window.__webpack_require__,
            window.webpackJsonp,
            window.webpackChunkelementorFrontend && window.webpackChunkelementorFrontend.__webpack_require__
        ].filter(Boolean);
        
        let fixedAny = false;
        
        webpackInstances.forEach((webpack, index) => {
            if (webpack && webpack.p) {
                const originalPath = webpack.p;
                console.log(`[Secondary Webpack Fix] Checking webpack instance ${index}:`, originalPath);
                
                // Check if path needs fixing
                if (originalPath.startsWith('file://') || 
                    originalPath.includes('/Users/') || 
                    originalPath.includes('/home/') ||
                    originalPath.includes('C:\\') ||
                    originalPath.includes('/Desktop/')) {
                    
                    const correctPath = calculateRelativePath();
                    webpack.p = correctPath;
                    
                    console.log(`[Secondary Webpack Fix] ✅ Fixed webpack instance ${index}`);
                    console.log(`[Secondary Webpack Fix] From: ${originalPath}`);
                    console.log(`[Secondary Webpack Fix] To: ${correctPath}`);
                    fixedAny = true;
                }
            }
        });
        
        return fixedAny;
    }
    
    // Try to fix immediately
    if (attemptWebpackFix()) {
        console.log('[Secondary Webpack Fix] Fixed webpack instances immediately');
    }
    
    // Monitor and fix periodically
    let attempts = 0;
    const maxAttempts = 200; // 20 seconds
    const checkInterval = setInterval(() => {
        attempts++;
        
        if (attemptWebpackFix()) {
            console.log(`[Secondary Webpack Fix] Fixed webpack after ${attempts * 100}ms`);
            clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
            console.log('[Secondary Webpack Fix] Stopped monitoring after 20 seconds');
            clearInterval(checkInterval);
        }
    }, 100);
    
    // Fix on specific events
    const events = ['DOMContentLoaded', 'load', 'beforeunload'];
    events.forEach(eventName => {
        window.addEventListener(eventName, function() {
            setTimeout(attemptWebpackFix, 100);
        });
    });
    
    // Watch for new script elements being added
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                            // A new script was added, check if webpack changed
                            setTimeout(attemptWebpackFix, 50);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.head || document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // Stop observing after 10 seconds
        setTimeout(() => observer.disconnect(), 10000);
    }
    
    console.log('[Secondary Webpack Fix] Secondary fix system initialized');
    
})();
