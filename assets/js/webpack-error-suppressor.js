/**
 * Webpack Error Suppressor
 * จัดการ webpack chunk loading errors แบบเงียบๆ 
 * ไม่แสดง error ใน console สำหรับ missing chunks
 */
(function() {
    'use strict';

    console.log('[Webpack Suppressor] Installing comprehensive error suppressors...');

    // Suppress console errors ทุกประเภท
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = function(...args) {
        const message = args.join(' ');
        
        // ข้าม webpack และ chunk related errors
        if (message.includes('ChunkLoadError') || 
            message.includes('Loading CSS chunk') ||
            message.includes('Loading chunk') ||
            message.includes('Failed to import') ||
            message.includes('__webpack_require__') ||
            message.includes('webpackJsonpCallback') ||
            message.includes('webpack-pro.runtime') ||
            message.includes('frontend.min.js') && message.includes('chunk') ||
            (message.includes('webpack') && message.includes('chunk'))) {
            return; // ไม่แสดง error
        }
        
        originalConsoleError.apply(console, args);
    };

    console.warn = function(...args) {
        const message = args.join(' ');
        
        if (message.includes('ChunkLoadError') || 
            message.includes('webpack') ||
            message.includes('chunk')) {
            return; // ไม่แสดง warning
        }
        
        originalConsoleWarn.apply(console, args);
    };

    // Override window.onerror ก่อนที่ scripts อื่นจะโหลด
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (typeof message === 'string' && (
            message.includes('ChunkLoadError') ||
            message.includes('webpack') ||
            message.includes('chunk') ||
            source && source.includes('webpack-pro.runtime') ||
            source && source.includes('frontend.min.js'))) {
            return true; // Suppress error
        }
        
        if (originalOnError) {
            return originalOnError.call(window, message, source, lineno, colno, error);
        }
        return false;
    };

    // Suppress unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        const message = event.reason?.message || event.reason || '';
        
        if (typeof message === 'string' && (
            message.includes('ChunkLoadError') ||
            message.includes('Loading CSS chunk') ||
            message.includes('Loading chunk') ||
            message.includes('webpack'))) {
            event.preventDefault();
            return false;
        }
    });

    // Suppress general window errors
    window.addEventListener('error', function(event) {
        const message = event.message || '';
        const filename = event.filename || '';
        
        if (message.includes('ChunkLoadError') ||
            message.includes('Loading CSS chunk') ||
            message.includes('Loading chunk') ||
            message.includes('webpack') ||
            filename.includes('webpack-pro.runtime') ||
            filename.includes('frontend.min.js')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);

    // เพิ่ม global error handler สำหรับ __webpack_require__
    if (typeof window !== 'undefined') {
        const originalWebpackRequire = window.__webpack_require__;
        if (originalWebpackRequire) {
            window.__webpack_require__ = function(moduleId) {
                try {
                    return originalWebpackRequire.call(this, moduleId);
                } catch (error) {
                    // Suppress webpack require errors
                    return {};
                }
            };
        }
    }

    console.log('[Webpack Suppressor] ✅ All error suppressors installed');

})();
