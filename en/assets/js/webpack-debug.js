// Webpack Debug Tool - Use this to diagnose webpack issues
// Add this script temporarily to check webpack status

(function() {
    'use strict';
    
    console.log('=== WEBPACK DEBUG TOOL ===');
    
    function debugWebpack() {
        console.log('--- Current Environment ---');
        console.log('Protocol:', window.location.protocol);
        console.log('Hostname:', window.location.hostname);
        console.log('Pathname:', window.location.pathname);
        console.log('Full URL:', window.location.href);
        
        console.log('--- Webpack Status ---');
        console.log('__webpack_require__ exists:', typeof __webpack_require__ !== 'undefined');
        
        if (typeof __webpack_require__ !== 'undefined') {
            console.log('__webpack_require__.p (publicPath):', __webpack_require__.p);
            console.log('__webpack_require__.e exists:', typeof __webpack_require__.e === 'function');
            console.log('__webpack_require__.u exists:', typeof __webpack_require__.u === 'function');
            
            if (typeof __webpack_require__.u === 'function') {
                console.log('Chunk 212 (text-editor) maps to:', __webpack_require__.u(212));
                console.log('Chunk 177 (image-carousel) maps to:', __webpack_require__.u(177));
                console.log('Chunk 180 (video) maps to:', __webpack_require__.u(180));
            }
        }
        
        console.log('--- Script Elements ---');
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach((script, index) => {
            console.log(`Script ${index}:`, script.src);
        });
        
        console.log('--- Webpack Chunks ---');
        if (window.webpackChunkelementorFrontend) {
            console.log('webpackChunkelementorFrontend exists');
            console.log('Chunks loaded:', Object.keys(window.webpackChunkelementorFrontend));
        }
        
        console.log('--- Element Status ---');
        const elementorElements = document.querySelectorAll('[class*="elementor"]');
        console.log('Elementor elements found:', elementorElements.length);
        
        console.log('--- Test Chunk Loading ---');
        if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.e) {
            console.log('Testing chunk 212 loading...');
            __webpack_require__.e(212).then(() => {
                console.log('✅ Chunk 212 loaded successfully');
            }).catch(error => {
                console.error('❌ Chunk 212 failed to load:', error.message);
                console.error('Full error:', error);
            });
        }
        
        console.log('=== END DEBUG ===');
    }
    
    // Run debug immediately
    debugWebpack();
    
    // Run debug after a delay
    setTimeout(debugWebpack, 2000);
    
    // Run debug on load
    window.addEventListener('load', () => {
        setTimeout(debugWebpack, 1000);
    });
    
    // Make debug function available globally
    window.debugWebpack = debugWebpack;
    
    console.log('Debug tool loaded. Run debugWebpack() in console anytime for status.');
    
})();
