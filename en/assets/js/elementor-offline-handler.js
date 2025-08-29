// Elementor Offline Handler - Static HTML Version
// Provides complete fallbacks for elementor components in offline/static environments

(function() {
    'use strict';
    
    console.log('[Elementor Offline] Starting comprehensive offline handler...');
    
    // Complete fallback implementations for elementor components
    const fallbackHandlers = {
        'text-editor': function() {
            return {
                init: function(element) {
                    console.log('[Elementor Offline] Text editor initialized');
                    if (element && element.$element) {
                        element.$element.addClass('elementor-text-editor-offline');
                    }
                },
                getContent: function() {
                    return document.querySelector('.elementor-text-editor')?.innerHTML || '';
                },
                setContent: function(content) {
                    const element = document.querySelector('.elementor-text-editor');
                    if (element) element.innerHTML = content;
                },
                destroy: function() {}
            };
        },
        
        'image-carousel': function() {
            return {
                init: function() {
                    console.log('[Elementor Offline] Image carousel initialized');
                    this.initCarousel();
                },
                initCarousel: function() {
                    document.querySelectorAll('.elementor-image-carousel').forEach(carousel => {
                        const wrapper = carousel.querySelector('.swiper-wrapper');
                        if (wrapper) {
                            wrapper.style.display = 'flex';
                            wrapper.style.transition = 'transform 0.3s ease';
                            
                            // Add basic navigation if needed
                            this.addBasicNavigation(carousel);
                        }
                    });
                },
                addBasicNavigation: function(carousel) {
                    const slides = carousel.querySelectorAll('.swiper-slide');
                    if (slides.length > 1) {
                        let currentSlide = 0;
                        const wrapper = carousel.querySelector('.swiper-wrapper');
                        
                        const updateSlide = () => {
                            wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
                        };
                        
                        // Auto-advance slides
                        setInterval(() => {
                            currentSlide = (currentSlide + 1) % slides.length;
                            updateSlide();
                        }, 5000);
                    }
                }
            };
        },
        
        'video': function() {
            return {
                init: function() {
                    console.log('[Elementor Offline] Video player initialized');
                    document.querySelectorAll('.elementor-video').forEach(video => {
                        video.style.display = 'block';
                        const iframe = video.querySelector('iframe');
                        const videoElement = video.querySelector('video');
                        
                        if (iframe) {
                            // Handle YouTube/Vimeo iframes
                            iframe.style.width = '100%';
                            iframe.style.height = 'auto';
                        }
                        
                        if (videoElement) {
                            videoElement.controls = true;
                        }
                    });
                }
            };
        },
        
        'accordion': function() {
            return {
                init: function() {
                    console.log('[Elementor Offline] Accordion initialized');
                    document.querySelectorAll('.elementor-accordion').forEach(accordion => {
                        this.initAccordion(accordion);
                    });
                },
                initAccordion: function(accordion) {
                    const items = accordion.querySelectorAll('.elementor-accordion-item');
                    items.forEach((item, index) => {
                        const title = item.querySelector('.elementor-tab-title');
                        const content = item.querySelector('.elementor-tab-content');
                        
                        if (title && content) {
                            title.style.cursor = 'pointer';
                            content.style.display = index === 0 ? 'block' : 'none';
                            
                            title.addEventListener('click', () => {
                                const isActive = content.style.display === 'block';
                                
                                // Close all others
                                items.forEach(otherItem => {
                                    const otherContent = otherItem.querySelector('.elementor-tab-content');
                                    if (otherContent) otherContent.style.display = 'none';
                                });
                                
                                // Toggle current
                                content.style.display = isActive ? 'none' : 'block';
                            });
                        }
                    });
                }
            };
        },
        
        'tabs': function() {
            return {
                init: function() {
                    console.log('[Elementor Offline] Tabs initialized');
                    document.querySelectorAll('.elementor-tabs').forEach(tabs => {
                        this.initTabs(tabs);
                    });
                },
                initTabs: function(tabs) {
                    const tabTitles = tabs.querySelectorAll('.elementor-tab-title');
                    const tabContents = tabs.querySelectorAll('.elementor-tab-content');
                    
                    tabTitles.forEach((title, index) => {
                        title.style.cursor = 'pointer';
                        title.addEventListener('click', () => {
                            // Remove active from all
                            tabTitles.forEach(t => t.classList.remove('elementor-active'));
                            tabContents.forEach(c => c.style.display = 'none');
                            
                            // Activate current
                            title.classList.add('elementor-active');
                            if (tabContents[index]) {
                                tabContents[index].style.display = 'block';
                            }
                        });
                        
                        // Show first tab by default
                        if (index === 0) {
                            title.classList.add('elementor-active');
                            if (tabContents[index]) {
                                tabContents[index].style.display = 'block';
                            }
                        }
                    });
                }
            };
        }
    };
    
    // Create a robust webpack chunk loading override
    function createChunkFallback() {
        if (typeof __webpack_require__ !== 'undefined') {
            // Store original chunk loading function
            const originalChunkLoad = __webpack_require__.e;
            
            __webpack_require__.e = function(chunkId) {
                console.log('[Elementor Offline] Attempting to load chunk:', chunkId);
                
                return originalChunkLoad.call(this, chunkId).catch(error => {
                    console.warn('[Elementor Offline] Chunk loading failed for chunk', chunkId, ':', error.message);
                    
                    // Provide appropriate fallback based on chunk ID
                    const chunkMap = {
                        212: 'text-editor',     // text-editor chunk
                        177: 'image-carousel',  // image-carousel chunk  
                        180: 'video',          // video chunk
                        131: 'accordion',      // accordion chunk
                        575: 'tabs',          // tabs chunk
                        707: 'alert',         // alert chunk
                        457: 'counter',       // counter chunk
                        234: 'progress',      // progress chunk
                        775: 'toggle'         // toggle chunk
                    };
                    
                    const handlerName = chunkMap[chunkId];
                    if (handlerName && fallbackHandlers[handlerName]) {
                        console.log('[Elementor Offline] Providing', handlerName, 'fallback');
                        return Promise.resolve({ 
                            default: fallbackHandlers[handlerName] 
                        });
                    } else {
                        console.log('[Elementor Offline] Providing generic fallback for chunk', chunkId);
                        return Promise.resolve({ 
                            default: function() { 
                                return { 
                                    init: function() {
                                        console.log('[Elementor Offline] Generic component initialized for chunk', chunkId);
                                    }
                                }; 
                            } 
                        });
                    }
                });
            };
            
            console.log('[Elementor Offline] Chunk loading fallback system initialized');
            return true;
        }
        return false;
    }
    
    // Initialize offline components immediately
    function initOfflineComponents() {
        // Initialize basic components
        if (fallbackHandlers['image-carousel']) {
            fallbackHandlers['image-carousel']().init();
        }
        if (fallbackHandlers['video']) {
            fallbackHandlers['video']().init();
        }
        if (fallbackHandlers['accordion']) {
            fallbackHandlers['accordion']().init();
        }
        if (fallbackHandlers['tabs']) {
            fallbackHandlers['tabs']().init();
        }
    }
    
    // Try to initialize immediately
    if (createChunkFallback()) {
        console.log('[Elementor Offline] Fallback system ready');
    }
    
    // Wait for webpack if not available yet
    let attempts = 0;
    const maxAttempts = 50;
    const checkWebpack = setInterval(() => {
        attempts++;
        
        if (createChunkFallback()) {
            console.log('[Elementor Offline] Fallback system initialized after', attempts * 100, 'ms');
            clearInterval(checkWebpack);
        } else if (attempts >= maxAttempts) {
            console.log('[Elementor Offline] Webpack not found, initializing basic components');
            initOfflineComponents();
            clearInterval(checkWebpack);
        }
    }, 100);
    
    // Initialize components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOfflineComponents);
    } else {
        initOfflineComponents();
    }
    
    // Initialize components when window loads
    window.addEventListener('load', function() {
        setTimeout(initOfflineComponents, 500);
    });
    
})();
