/*!
 * FadeIn Animation System
 * Reusable animation system for fadeInLeft and fadeInRight elements
 * Compatible with Elementor and custom implementations
 */

(function() {
    'use strict';
    
    /**
     * Initialize FadeIn Animation System
     */
    function initFadeInAnimations() {
        // Select all elements with animation classes
        const fadeInLeftElements = document.querySelectorAll('.fadeInLeftElement');
        const fadeInRightElements = document.querySelectorAll('.fadeInRightElement');
        const elementorInvisible = document.querySelectorAll('.elementor-invisible');
        
        // Create intersection observer for animations
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    // Add staggered delay for sequential animation effect
                    setTimeout(function() {
                        entry.target.classList.add('fade-in-active');
                    }, index * 200); // 200ms increments for staggered delays
                    
                    // Stop observing this element after animation triggers
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Trigger when 20% of the element is visible
            threshold: 0.2,
            // Add margin to trigger slightly before element comes into view
            rootMargin: '50px 0px'
        });
        
        // Observe all fadeInLeft elements
        fadeInLeftElements.forEach(function(element) {
            observer.observe(element);
        });
        
        // Observe all fadeInRight elements  
        fadeInRightElements.forEach(function(element) {
            observer.observe(element);
        });
        
        // Observe elementor invisible elements
        elementorInvisible.forEach(function(element) {
            observer.observe(element);
        });
        
        // Timeline specific animation handling
        initTimelineAnimations();
        
        // Accordion specific animation handling
        initAccordionAnimations();
    }
    
    /**
     * Initialize Timeline specific animations
     */
    function initTimelineAnimations() {
        const timelineLeftParts = document.querySelectorAll('.left-part .fadeInLeftElement, .bdt-timeline .left-part .bdt-timeline-item-main');
        const timelineRightParts = document.querySelectorAll('.right-part .fadeInRightElement, .bdt-timeline .right-part .bdt-timeline-item-main');
        
        // Create specific observer for timeline elements
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('fade-in-active');
                        // Also add fadeInLeft/Right classes for timeline items
                        if (entry.target.closest('.left-part')) {
                            entry.target.classList.add('fadeInLeftElement');
                        } else if (entry.target.closest('.right-part')) {
                            entry.target.classList.add('fadeInRightElement');
                        }
                    }, index * 200);
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '100px 0px'
        });
        
        // Observe timeline elements
        timelineLeftParts.forEach(function(element) {
            timelineObserver.observe(element);
        });
        
        timelineRightParts.forEach(function(element) {
            timelineObserver.observe(element);
        });
    }
    
    /**
     * Initialize Accordion specific animations
     */
    function initAccordionAnimations() {
        const accordionItems = document.querySelectorAll('.elementor-accordion .elementor-accordion-item');
        
        if (accordionItems.length > 0) {
            const accordionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry, index) {
                    if (entry.isIntersecting) {
                        setTimeout(function() {
                            entry.target.classList.add('fade-in-active');
                        }, index * 150);
                        accordionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '30px 0px'
            });
            
            accordionItems.forEach(function(element) {
                element.classList.add('fadeInLeftElement');
                accordionObserver.observe(element);
            });
        }
    }
    
    /**
     * Add required CSS if not already present
     */
    function addAnimationCSS() {
        // Check if styles already exist
        if (document.querySelector('#fadein-animation-styles')) {
            return;
        }
        
        const css = `
            /* FadeIn from Left Animation */
            .fadeInLeftElement {
                opacity: 0;
                transform: translateX(-100px);
                transition: all 0.8s ease-out;
            }
            
            .fadeInLeftElement.fade-in-active {
                opacity: 1;
                transform: translateX(0);
            }
            
            /* FadeIn from Right Animation */
            .fadeInRightElement {
                opacity: 0;
                transform: translateX(100px);
                transition: all 0.8s ease-out;
            }
            
            .fadeInRightElement.fade-in-active {
                opacity: 1;
                transform: translateX(0);
            }
            
            /* Elementor invisible class support */
            .elementor-invisible {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.6s ease-out;
            }
            
            .elementor-invisible.fade-in-active {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Timeline specific animations */
            .bdt-timeline .left-part .fadeInLeftElement {
                opacity: 0;
                transform: translateX(-50px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .bdt-timeline .right-part .fadeInRightElement {
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .bdt-timeline .left-part .fadeInLeftElement.fade-in-active,
            .bdt-timeline .right-part .fadeInRightElement.fade-in-active {
                opacity: 1;
                transform: translateX(0);
            }
            
            /* Accordion animations */
            .elementor-accordion .elementor-accordion-item.fadeInLeftElement {
                opacity: 0;
                transform: translateX(-30px);
                transition: all 0.6s ease-out;
            }
            
            .elementor-accordion .elementor-accordion-item.fadeInLeftElement.fade-in-active {
                opacity: 1;
                transform: translateX(0);
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'fadein-animation-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    /**
     * Initialize the animation system when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addAnimationCSS();
                initFadeInAnimations();
            });
        } else {
            addAnimationCSS();
            initFadeInAnimations();
        }
    }
    
    // Initialize the system
    init();
    
    // Expose public API for manual initialization
    window.FadeInAnimations = {
        init: initFadeInAnimations,
        initTimeline: initTimelineAnimations,
        initAccordion: initAccordionAnimations,
        addCSS: addAnimationCSS
    };
    
})();