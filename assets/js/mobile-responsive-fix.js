// Mobile responsive fix for Elementor elements
document.addEventListener('DOMContentLoaded', function() {
    // Function to fix mobile responsive issues
    function fixMobileResponsive() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Target the specific problematic elements
            const elements = [
                'elementor-element-0dbbb11',
                'elementor-element-b09724b', 
                'elementor-element-3162bbd'
            ];
            
            elements.forEach(function(elementId) {
                const element = document.querySelector('.elementor-element.' + elementId);
                if (element) {
                    // Force visibility and proper styling
                    element.style.setProperty('display', 'flex', 'important');
                    element.style.setProperty('visibility', 'visible', 'important');
                    element.style.setProperty('opacity', '1', 'important');
                    element.style.setProperty('position', 'static', 'important');
                    element.style.setProperty('transform', 'none', 'important');
                    element.style.setProperty('--translateX', '0px', 'important');
                    element.style.setProperty('--translateY', '0px', 'important');
                    element.style.setProperty('left', 'auto', 'important');
                    element.style.setProperty('right', 'auto', 'important');
                    element.style.setProperty('top', 'auto', 'important');
                    element.style.setProperty('width', '100%', 'important');
                    element.style.setProperty('max-width', '95%', 'important');
                    element.style.setProperty('margin', '20px auto', 'important');
                    element.style.setProperty('flex-direction', 'column', 'important');
                    element.style.setProperty('align-items', 'center', 'important');
                    element.style.setProperty('justify-content', 'center', 'important');
                    
                    // Remove any motion effects attributes
                    element.removeAttribute('style');
                    element.classList.add('mobile-responsive-fixed');
                }
            });
            
            // Fix parent container
            const parentContainer = document.querySelector('.elementor-element.elementor-element-249d89c');
            if (parentContainer) {
                parentContainer.style.setProperty('display', 'flex', 'important');
                parentContainer.style.setProperty('flex-direction', 'column', 'important');
                parentContainer.style.setProperty('flex-wrap', 'nowrap', 'important');
                parentContainer.style.setProperty('align-items', 'center', 'important');
                parentContainer.style.setProperty('justify-content', 'flex-start', 'important');
                parentContainer.style.setProperty('gap', '20px', 'important');
                parentContainer.style.setProperty('width', '100%', 'important');
                parentContainer.style.setProperty('overflow', 'visible', 'important');
            }
        }
    }
    
    // Run on load
    fixMobileResponsive();
    
    // Run on resize
    window.addEventListener('resize', function() {
        // Debounce the resize event
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(fixMobileResponsive, 250);
    });
    
    // Also check after any potential dynamic content loading
    setTimeout(fixMobileResponsive, 1000);
});

// Force remove motion effects on mobile
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', function() {
        // Disable Elementor motion effects on mobile
        const motionElements = document.querySelectorAll('.elementor-motion-effects-element');
        motionElements.forEach(function(element) {
            if (element.style.transform) {
                element.style.setProperty('transform', 'none', 'important');
            }
            element.style.setProperty('--translateX', '0px', 'important');
            element.style.setProperty('--translateY', '0px', 'important');
        });
    });
}
