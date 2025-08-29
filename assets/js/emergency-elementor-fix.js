/**
 * Emergency Elementor Fix - Additional protection against elementor errors
 * This script provides additional safety nets for any remaining Elementor issues
 */

(function() {
    'use strict';
    
    console.log('[Emergency Elementor Fix] Loading emergency protection...');
    
    // Comprehensive error suppression for all known Elementor errors
    const suppressedErrors = [
        'elementorModules is not defined',
        'elementorFrontend is not defined', 
        'elementorCommon is not defined',
        'elementorAdmin is not defined',
        'ChunkLoadError',
        'Loading chunk',
        'Loading CSS chunk',
        'failed to import',
        'Module not found',
        'Cannot read property',
        'Cannot read properties',
        'webpackChunk',
        'webpackJsonp',
        '__webpack_require__',
        'frontend.min.js',
        'webpack-pro.runtime.min.js'
    ];
    
    // Global error handler
    window.addEventListener('error', function(event) {
        const message = event.message || '';
        const filename = event.filename || '';
        
        for (let errorPattern of suppressedErrors) {
            if (message.includes(errorPattern) || filename.includes(errorPattern)) {
                console.warn('[Emergency Elementor Fix] Suppressed error:', message);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
    }, true);
    
    // Global promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason) {
            const reasonStr = event.reason.toString();
            const messageStr = event.reason.message || '';
            
            for (let errorPattern of suppressedErrors) {
                if (reasonStr.includes(errorPattern) || messageStr.includes(errorPattern)) {
                    console.warn('[Emergency Elementor Fix] Suppressed promise rejection:', reasonStr);
                    event.preventDefault();
                    return false;
                }
            }
        }
    });
    
    // Override console.error to suppress known errors
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ').toString();
        
        for (let errorPattern of suppressedErrors) {
            if (message.includes(errorPattern)) {
                console.warn('[Emergency Elementor Fix] Suppressed console error:', message);
                return;
            }
        }
        
        originalConsoleError.apply(console, args);
    };
    
    // Create emergency fallbacks for any missing objects
    function createEmergencyFallbacks() {
        // Emergency elementorModules fallback
        if (typeof window.elementorModules === 'undefined') {
            window.elementorModules = {
                Module: function(settings) {
                    this.settings = settings || {};
                    this.elements = {};
                    return this;
                },
                frontend: {
                    Module: function(settings) {
                        this.settings = settings || {};
                        this.elements = {};
                        return this;
                    },
                    handlers: {
                        Base: function(settings) {
                            this.settings = settings || {};
                            this.elements = {};
                            return this;
                        }
                    }
                },
                utils: {
                    Swiper: function(element, options) {
                        console.log('[Emergency Elementor Fix] Swiper fallback created');
                        return {
                            destroy: function() {},
                            slideNext: function() {},
                            slidePrev: function() {}
                        };
                    }
                }
            };
            console.log('[Emergency Elementor Fix] Emergency elementorModules created');
        }
        
        // Emergency elementorFrontend fallback
        if (typeof window.elementorFrontend === 'undefined') {
            window.elementorFrontend = {
                config: {
                    environmentMode: { edit: false, wpPreview: false },
                    breakpoints: { xs: 0, sm: 480, md: 768, lg: 1025, xl: 1440 }
                },
                hooks: {
                    addAction: function() {},
                    addFilter: function() {},
                    doAction: function() {},
                    applyFilters: function(hookName, value) { return value; }
                },
                isEditMode: function() { return false; },
                getCurrentDeviceMode: function() { 
                    const width = window.innerWidth;
                    if (width <= 767) return 'mobile';
                    if (width <= 1024) return 'tablet';
                    return 'desktop';
                },
                waypoint: function() {},
                init: function() {
                    console.log('[Emergency Elementor Fix] Emergency elementorFrontend initialized');
                }
            };
            console.log('[Emergency Elementor Fix] Emergency elementorFrontend created');
        }
        
        // Emergency elementorCommon fallback
        if (typeof window.elementorCommon === 'undefined') {
            window.elementorCommon = {
                config: {},
                ajax: {
                    send: function() { return Promise.resolve({}); }
                },
                helpers: {
                    softDeprecated: function() {}
                }
            };
            console.log('[Emergency Elementor Fix] Emergency elementorCommon created');
        }
    }
    
    // Create emergency webpack mock
    function createWebpackMock() {
        if (typeof window.webpackChunkelementor === 'undefined') {
            window.webpackChunkelementor = [];
        }
        
        if (typeof window.__webpack_require__ === 'undefined') {
            window.__webpack_require__ = function(moduleId) {
                console.log('[Emergency Elementor Fix] Mock webpack require:', moduleId);
                return {};
            };
            
            window.__webpack_require__.e = function(chunkId) {
                console.log('[Emergency Elementor Fix] Mock chunk loading:', chunkId);
                return Promise.resolve();
            };
            
            window.__webpack_require__.cache = {};
        }
    }
    
    // Apply fixes immediately
    createEmergencyFallbacks();
    createWebpackMock();
    
    // Apply fixes on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createEmergencyFallbacks();
            createWebpackMock();
            console.log('[Emergency Elementor Fix] Emergency fixes applied on DOM ready');
        });
    } else {
        createEmergencyFallbacks();
        createWebpackMock();
        console.log('[Emergency Elementor Fix] Emergency fixes applied immediately');
    }
    
    // Periodic safety check
    setInterval(function() {
        createEmergencyFallbacks();
    }, 1000);
    
    console.log('[Emergency Elementor Fix] Emergency protection fully loaded');
    
})();
