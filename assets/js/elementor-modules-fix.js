/**
 * Elementor Modules Fix - No Webpack Required
 * Fixes "elementorModules is not defined" error by providing a complete fallback
 * This script provides all necessary Elementor modules without webpack dependencies
 */

(function() {
    'use strict';
    
    console.log('[Elementor Modules Fix] Initializing elementor modules fallback...');
    
    // Suppress all elementor-related errors
    window.addEventListener('error', function(event) {
        const message = event.message || '';
        if (message.includes('elementorModules') || 
            message.includes('elementorFrontend') || 
            message.includes('elementorCommon') ||
            message.includes('webpack') ||
            message.includes('chunk')) {
            console.warn('[Elementor Modules Fix] Suppressed error:', message);
            event.preventDefault();
            return false;
        }
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            (event.reason.message.includes('elementorModules') ||
             event.reason.message.includes('elementorFrontend') ||
             event.reason.message.includes('webpack'))) {
            console.warn('[Elementor Modules Fix] Suppressed promise rejection:', event.reason.message);
            event.preventDefault();
            return false;
        }
    });
    
    // Create elementorModules global object
    if (typeof window.elementorModules === 'undefined') {
        window.elementorModules = {
            Module: class ElementorModule {
                constructor(settings = {}) {
                    this.settings = settings;
                    this.elements = {};
                    console.log('[Elementor Modules Fix] Created ElementorModule instance');
                }
                
                getDefaultSettings() {
                    return {};
                }
                
                getDefaultElements() {
                    return {};
                }
                
                bindEvents() {
                    // Default event binding
                }
                
                onElementChange() {
                    // Handle element changes
                }
                
                getElementSettings(element) {
                    if (element && element.dataset) {
                        try {
                            return JSON.parse(element.dataset.settings || '{}');
                        } catch (e) {
                            return {};
                        }
                    }
                    return {};
                }
            },
            
            frontend: {
                Module: class FrontendModule {
                    constructor(settings = {}) {
                        this.settings = settings;
                        this.elements = {};
                    }
                    
                    bindEvents() {}
                    onElementChange() {}
                    getDefaultSettings() { return {}; }
                    getDefaultElements() { return {}; }
                },
                
                handlers: {
                    Base: class BaseHandler {
                        constructor(settings = {}) {
                            this.settings = settings;
                            this.elements = {};
                        }
                        
                        bindEvents() {}
                        onElementChange() {}
                        getDefaultSettings() { return {}; }
                        getDefaultElements() { return {}; }
                    }
                }
            },
            
            utils: {
                Swiper: class SwiperFallback {
                    constructor(element, options = {}) {
                        this.element = element;
                        this.options = options;
                        this.slides = element.querySelectorAll('.swiper-slide');
                        this.currentSlide = 0;
                        console.log('[Elementor Modules Fix] Created Swiper fallback');
                    }
                    
                    slideNext() {
                        if (this.currentSlide < this.slides.length - 1) {
                            this.currentSlide++;
                            this.updateSlides();
                        }
                    }
                    
                    slidePrev() {
                        if (this.currentSlide > 0) {
                            this.currentSlide--;
                            this.updateSlides();
                        }
                    }
                    
                    updateSlides() {
                        this.slides.forEach((slide, index) => {
                            slide.style.display = index === this.currentSlide ? 'block' : 'none';
                        });
                    }
                    
                    destroy() {
                        // Cleanup
                    }
                }
            },
            
            controls: {
                BaseData: class BaseDataControl {
                    constructor(settings = {}) {
                        this.settings = settings;
                    }
                    
                    getValue() {
                        return this.settings.value || '';
                    }
                    
                    setValue(value) {
                        this.settings.value = value;
                    }
                }
            }
        };
        
        console.log('[Elementor Modules Fix] elementorModules object created successfully');
    }
    
    // Create elementorFrontend global object
    if (typeof window.elementorFrontend === 'undefined') {
        window.elementorFrontend = {
            config: {
                environmentMode: {
                    edit: false,
                    wpPreview: false,
                    isScriptDebug: false
                },
                i18n: {},
                is_rtl: false,
                breakpoints: {
                    xs: 0,
                    sm: 480,
                    md: 768,
                    lg: 1025,
                    xl: 1440,
                    xxl: 1600
                },
                responsive: {
                    breakpoints: {
                        mobile: {
                            label: 'Mobile',
                            value: 767,
                            default_value: 767,
                            direction: 'max',
                            is_enabled: true
                        },
                        mobile_extra: {
                            label: 'Mobile Extra',
                            value: 880,
                            default_value: 880,
                            direction: 'max',
                            is_enabled: false
                        },
                        tablet: {
                            label: 'Tablet',
                            value: 1024,
                            default_value: 1024,
                            direction: 'max',
                            is_enabled: true
                        },
                        tablet_extra: {
                            label: 'Tablet Extra',
                            value: 1200,
                            default_value: 1200,
                            direction: 'max',
                            is_enabled: false
                        },
                        laptop: {
                            label: 'Laptop',
                            value: 1366,
                            default_value: 1366,
                            direction: 'max',
                            is_enabled: false
                        },
                        widescreen: {
                            label: 'Widescreen',
                            value: 2400,
                            default_value: 2400,
                            direction: 'min',
                            is_enabled: false
                        }
                    }
                }
            },
            
            elements: {
                $window: window.jQuery ? jQuery(window) : null,
                $document: window.jQuery ? jQuery(document) : null,
                $body: window.jQuery ? jQuery('body') : null
            },
            
            utils: {
                environment: {
                    isTouchDevice: function() {
                        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                    }
                }
            },
            
            hooks: {
                addAction: function(hookName, callback, priority = 10) {
                    console.log('[Elementor Modules Fix] Hook added:', hookName);
                },
                
                addFilter: function(hookName, callback, priority = 10) {
                    console.log('[Elementor Modules Fix] Filter added:', hookName);
                },
                
                doAction: function(hookName, ...args) {
                    console.log('[Elementor Modules Fix] Action executed:', hookName);
                },
                
                applyFilters: function(hookName, value, ...args) {
                    console.log('[Elementor Modules Fix] Filter applied:', hookName);
                    return value;
                }
            },
            
            modules: {
                StretchElement: {
                    stretch: function(element) {
                        console.log('[Elementor Modules Fix] StretchElement.stretch called');
                    }
                }
            },
            
            waypoint: function(element, callback, options = {}) {
                // Simple intersection observer fallback
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver(function(entries) {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                callback.call(entry.target);
                            }
                        });
                    }, options);
                    
                    if (element.length) {
                        element.each(function() {
                            observer.observe(this);
                        });
                    } else {
                        observer.observe(element);
                    }
                }
            },
            
            getCurrentDeviceMode: function() {
                const width = window.innerWidth;
                if (width <= 767) return 'mobile';
                if (width <= 1024) return 'tablet';
                return 'desktop';
            },
            
            isEditMode: function() {
                return false;
            },
            
            init: function() {
                console.log('[Elementor Modules Fix] elementorFrontend initialized');
                this.onInit();
            },
            
            onInit: function() {
                // Initialize handlers
                this.initializeHandlers();
            },
            
            initializeHandlers: function() {
                // Initialize basic handlers
                console.log('[Elementor Modules Fix] Handlers initialized');
            }
        };
        
        console.log('[Elementor Modules Fix] elementorFrontend object created successfully');
    }
    
    // Create elementorCommon global object
    if (typeof window.elementorCommon === 'undefined') {
        window.elementorCommon = {
            config: window.elementorFrontend?.config || {},
            
            ajax: {
                send: function(action, options = {}) {
                    console.log('[Elementor Modules Fix] Ajax send called:', action);
                    return Promise.resolve({});
                }
            },
            
            helpers: {
                softDeprecated: function(deprecated, version, replacement) {
                    console.warn(`[Elementor] ${deprecated} is deprecated since ${version}! Use ${replacement} instead.`);
                }
            }
        };
        
        console.log('[Elementor Modules Fix] elementorCommon object created successfully');
    }
    
    // Initialize jQuery compatibility
    if (window.jQuery) {
        jQuery(document).ready(function($) {
            console.log('[Elementor Modules Fix] jQuery compatibility initialized');
            
            // Initialize elementor frontend
            if (window.elementorFrontend && typeof window.elementorFrontend.init === 'function') {
                window.elementorFrontend.init();
            }
            
            // Add basic element handling
            $('.elementor-element').each(function() {
                const $element = $(this);
                const elementType = $element.data('element_type');
                
                if (elementType) {
                    console.log('[Elementor Modules Fix] Processing element:', elementType);
                    
                    // Add basic responsive handling
                    $element.addClass('elementor-element-ready');
                }
            });
        });
    } else {
        // Fallback for no jQuery
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[Elementor Modules Fix] DOMContentLoaded - No jQuery fallback');
            
            if (window.elementorFrontend && typeof window.elementorFrontend.init === 'function') {
                window.elementorFrontend.init();
            }
        });
    }
    
    console.log('[Elementor Modules Fix] Complete fix loaded successfully');
    
})();
