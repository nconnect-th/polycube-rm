/**
 * Smooth Motion to Zero - Dynamic Currency Conversion DCC Page
 * Animates translateX and translateY to 0 when elements come into view
 * No webpack required - Pure JavaScript solution
 */

(function() {
    'use strict';
    
    console.log('[Motion to Zero] Initializing smooth motion animation system...');
    
    // Configuration for instant positioning (no animation)
    const animationConfig = {
        // Instant positioning - no animation
        instant: {
            duration: 0,
            easing: 'linear',
            threshold: 0.1
        },
        // Standard smooth animation (kept for compatibility)
        standard: {
            duration: 1200,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            threshold: 0.3
        },
        // Fast animation for quick elements
        fast: {
            duration: 800,
            easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            threshold: 0.2
        },
        // Slow animation for heavy elements
        slow: {
            duration: 1800,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            threshold: 0.4
        }
    };
    
    // Element-specific configurations - All set to normal position (0,0)
    const elementConfigs = [
        {
            // Parent motion effects container - Normal position
            selector: '[data-id="74bd309"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            isParent: true,
            disableMotion: true
        },
        {
            // Element - Normal position (no translateX)
            selector: '[data-id="1e53800"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            disableMotion: true
        },
        {
            // Element - Normal position (no translateY)
            selector: '[data-id="8b06e5c"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            disableMotion: true
        },
        {
            // Element - Normal position (no translateY)
            selector: '[data-id="03f2cc7"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            disableMotion: true
        },
        {
            // Background element - Normal position
            selector: '[data-id="0991d9f"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            isBackground: true,
            disableMotion: true
        },
        {
            // Additional motion effects parent
            selector: '[data-id="3f86b776"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            isParent: true,
            disableMotion: true
        },
        {
            // Section with background overlay
            selector: '[data-id="20e3daf7"]',
            initialX: 0,
            initialY: 0,
            targetX: 0,
            targetY: 0,
            animationType: 'instant',
            delay: 0,
            disableMotion: true
        }
    ];
    
    // Animation state tracking
    const animationStates = new Map();
    
    // Utility function to get element's current transform values
    function getCurrentTransform(element) {
        const style = window.getComputedStyle(element);
        const transform = style.transform;
        
        if (transform === 'none') {
            return { x: 0, y: 0 };
        }
        
        const matrix = transform.match(/matrix.*\((.+)\)/);
        if (matrix) {
            const values = matrix[1].split(', ');
            return {
                x: parseFloat(values[4]) || 0,
                y: parseFloat(values[5]) || 0
            };
        }
        
        // Parse CSS variables if present
        const translateX = element.style.getPropertyValue('--translateX');
        const translateY = element.style.getPropertyValue('--translateY');
        
        return {
            x: translateX ? parseFloat(translateX) : 0,
            y: translateY ? parseFloat(translateY) : 0
        };
    }
    
    // Easing function implementation
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    // Animation function
    function animateToZero(element, config, animationType = 'standard') {
        const elementId = element.dataset.id || element.className;
        
        // Prevent multiple animations on the same element
        if (animationStates.get(elementId)) {
            console.log('[Motion to Zero] Animation already running for:', elementId);
            return;
        }
        
        const animation = animationConfig[animationType];
        const startTime = performance.now();
        const currentTransform = getCurrentTransform(element);
        
        // Use config values or current values as fallback
        const startX = config.initialX !== undefined ? config.initialX : currentTransform.x;
        const startY = config.initialY !== undefined ? config.initialY : currentTransform.y;
        const endX = config.targetX || 0;
        const endY = config.targetY || 0;
        
        console.log(`[Motion to Zero] Animating ${elementId} from (${startX}, ${startY}) to (${endX}, ${endY})`);
        
        // Mark animation as active
        animationStates.set(elementId, true);
        
        // Apply initial transform if element doesn't have one
        if (!element.style.transform && (startX !== 0 || startY !== 0)) {
            element.style.setProperty('--translateX', `${startX}px`);
            element.style.setProperty('--translateY', `${startY}px`);
            element.style.transform = `translateX(${startX}px) translateY(${startY}px)`;
        }
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            // Apply easing
            const easedProgress = easeInOutCubic(progress);
            
            // Calculate current position
            const currentX = startX + (endX - startX) * easedProgress;
            const currentY = startY + (endY - startY) * easedProgress;
            
            // Apply transform
            if (config.isBackground) {
                // Handle background motion effects differently
                element.style.setProperty('--translateX', `${currentX}px`);
                element.style.setProperty('--translateY', `${currentY}px`);
            } else if (config.isParent) {
                // Handle parent motion effects container
                element.style.setProperty('--translateX', `${currentX}px`);
                element.style.setProperty('--translateY', `${currentY}px`);
                // Ensure child elements inherit the parent's motion state
                element.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`;
                
                // Also disable any motion effects on child elements
                const childElements = element.querySelectorAll('.elementor-motion-effects-element');
                childElements.forEach(child => {
                    child.style.setProperty('--e-transform-transition-duration', '0ms');
                });
            } else {
                // Standard element transform
                element.style.setProperty('--translateX', `${currentX}px`);
                element.style.setProperty('--translateY', `${currentY}px`);
                element.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`;
            }
            
            // Update transition duration for smooth animation
            element.style.setProperty('--e-transform-transition-duration', '0ms');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                console.log(`[Motion to Zero] Animation complete for ${elementId}`);
                animationStates.set(elementId, false);
                
                // Ensure final position is exact
                element.style.setProperty('--translateX', `${endX}px`);
                element.style.setProperty('--translateY', `${endY}px`);
                element.style.transform = `translateX(${endX}px) translateY(${endY}px)`;
                
                // Add completion class
                element.classList.add('motion-complete');
            }
        }
        
        // Add smooth transition for better visual effect
        element.style.transition = `transform ${animation.duration}ms ${animation.easing}`;
        
        // Start animation with delay if specified
        if (config.delay > 0) {
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, config.delay);
        } else {
            requestAnimationFrame(animate);
        }
    }
    
    // Intersection Observer for viewport detection
    function createViewportObserver() {
        // Different thresholds for different animation types
        const observers = {};
        
        Object.keys(animationConfig).forEach(type => {
            const config = animationConfig[type];
            
            observers[type] = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const elementConfig = element._motionConfig;
                        
                        if (elementConfig && !animationStates.get(element.dataset.id || element.className)) {
                            console.log(`[Motion to Zero] Element ${element.dataset.id} entered viewport`);
                            animateToZero(element, elementConfig, elementConfig.animationType);
                            
                            // Stop observing this element
                            observers[type].unobserve(element);
                        }
                    }
                });
            }, {
                threshold: config.threshold,
                rootMargin: '20px'
            });
        });
        
        return observers;
    }
    
    // Initialize motion system - Focus on disabling motion effects
    function initializeMotionSystem() {
        console.log('[Motion to Zero] Setting up normal positioning (disabling motion effects)...');
        
        const observers = createViewportObserver();
        
        // Apply configurations to elements - Set all to normal position
        elementConfigs.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            
            elements.forEach(element => {
                if (element) {
                    console.log(`[Motion to Zero] Setting normal position for element: ${config.selector}`);
                    
                    // Store config on element
                    element._motionConfig = config;
                    
                    // Force normal position (0,0) immediately
                    element.style.setProperty('--translateX', '0px');
                    element.style.setProperty('--translateY', '0px');
                    element.style.setProperty('--e-transform-transition-duration', '0ms');
                    
                    // Remove any existing transforms
                    element.style.transform = 'translateX(0px) translateY(0px)';
                    
                    // Disable Elementor motion effects
                    if (config.isParent) {
                        // For parent elements, disable motion effects on children too
                        const childElements = element.querySelectorAll('.elementor-motion-effects-element');
                        childElements.forEach(child => {
                            child.style.setProperty('--translateX', '0px');
                            child.style.setProperty('--translateY', '0px');
                            child.style.setProperty('--e-transform-transition-duration', '0ms');
                            child.style.transform = 'translateX(0px) translateY(0px)';
                        });
                    }
                    
                    // If motion is disabled, just set position and skip animation
                    if (config.disableMotion) {
                        element.style.setProperty('--translateX', '0px');
                        element.style.setProperty('--translateY', '0px');
                        element.style.transform = 'translateX(0px) translateY(0px)';
                        element.classList.add('motion-disabled');
                        console.log(`[Motion to Zero] Motion disabled for ${config.selector} - set to normal position`);
                        return; // Skip viewport observation
                    }
                    
                    // Add to appropriate observer (only if motion is not disabled)
                    const observer = observers[config.animationType];
                    if (observer) {
                        observer.observe(element);
                        console.log(`[Motion to Zero] Observing element with ${config.animationType} animation`);
                    }
                    
                    // Add identifying class
                    element.classList.add('motion-to-zero-element');
                }
            });
        });
    }
    
    // Enhanced CSS for smooth animations
    function addMotionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Motion to Zero Animation Styles */
            .motion-to-zero-element {
                will-change: transform;
                backface-visibility: hidden;
                transform-style: preserve-3d;
            }
            
            .motion-to-zero-element.motion-complete {
                will-change: auto;
            }
            
            /* Override any existing motion effects when animation is active */
            .motion-to-zero-element {
                transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }
            
            /* Ensure smooth performance */
            .elementor-motion-effects-element.motion-to-zero-element {
                transform: translateX(var(--translateX, 0)) translateY(var(--translateY, 0)) !important;
            }
            
            /* Handle background motion effects */
            [data-id="0991d9f"] {
                transition: all 1.8s cubic-bezier(0.19, 1, 0.22, 1) !important;
            }
            
            /* Disable original Elementor motion effects during our animation */
            .motion-to-zero-element[data-settings*="motion_fx"] {
                --e-transform-transition-duration: 0ms !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[Motion to Zero] Motion styles added');
    }
    
    // Handle resize for responsive behavior
    function handleResize() {
        console.log('[Motion to Zero] Handling resize...');
        // Re-calculate positions if needed
        elementConfigs.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            elements.forEach(element => {
                if (element.classList.contains('motion-complete')) {
                    // Ensure final position is maintained
                    element.style.setProperty('--translateX', '0px');
                    element.style.setProperty('--translateY', '0px');
                    element.style.transform = 'translateX(0px) translateY(0px)';
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    function initialize() {
        console.log('[Motion to Zero] Initializing motion system...');
        
        addMotionStyles();
        initializeMotionSystem();
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 100);
        });
        
        console.log('[Motion to Zero] Motion system fully initialized');
    }
    
    // Start initialization immediately when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initialize();
            
            // Force normal positioning immediately after DOM is loaded
            setTimeout(function() {
                forceNormalPositioning();
            }, 100);
        });
    } else {
        initialize();
        
        // Force normal positioning immediately
        setTimeout(function() {
            forceNormalPositioning();
        }, 100);
    }
    
    // Function to force normal positioning
    function forceNormalPositioning() {
        console.log('[Motion to Zero] Forcing normal positioning for all elements...');
        
        // Target all motion effects elements
        const allMotionElements = document.querySelectorAll([
            '[data-id="74bd309"]',
            '[data-id="1e53800"]', 
            '[data-id="8b06e5c"]',
            '[data-id="03f2cc7"]',
            '[data-id="0991d9f"]',
            '[data-id="3f86b776"]',
            '[data-id="20e3daf7"]',
            '.elementor-motion-effects-element',
            '.elementor-motion-effects-parent',
            '.elementor-widget-wrap[style*="translateY"]',
            '[style*="--translateY"]'
        ].join(','));
        
        allMotionElements.forEach(function(element) {
            if (element) {
                element.style.setProperty('--translateX', '0px', 'important');
                element.style.setProperty('--translateY', '0px', 'important');
                element.style.setProperty('--e-transform-transition-duration', '0ms', 'important');
                element.style.setProperty('transform', 'translateX(0px) translateY(0px)', 'important');
                element.style.setProperty('transition', 'none', 'important');
                
                // Remove inline transform styles
                element.style.removeProperty('transform');
                element.style.transform = 'translateX(0px) translateY(0px)';
                
                console.log('[Motion to Zero] Forced normal position for:', element.dataset.id || element.className);
            }
        });
        
        // Fix elementor containers and column gaps
        const containers = document.querySelectorAll('.elementor-container');
        containers.forEach(function(container) {
            if (container) {
                container.style.setProperty('display', 'flex', 'important');
                container.style.setProperty('flex-wrap', 'wrap', 'important');
                
                if (container.classList.contains('elementor-column-gap-default')) {
                    container.style.setProperty('gap', '20px', 'important');
                } else if (container.classList.contains('elementor-column-gap-wide')) {
                    container.style.setProperty('gap', '40px', 'important');
                }
                
                console.log('[Motion to Zero] Fixed container layout for:', container.className);
            }
        });
    }
    
    // Global access for debugging
    window.MotionToZero = {
        animationStates,
        elementConfigs,
        animateToZero
    };
    
})();
