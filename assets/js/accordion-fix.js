/**
 * Accordion Fix for Offline Mode
 * แก้ไข Elementor Accordion ให้ทำงานได้ใน offline mode
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix Elementor Accordion functionality
    function initAccordions() {
        const accordions = document.querySelectorAll('.elementor-accordion-item');
        
        accordions.forEach(function(item) {
            const title = item.querySelector('.elementor-tab-title');
            const content = item.querySelector('.elementor-tab-content');
            
            if (title && content) {
                title.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle current item
                    const isActive = item.classList.contains('elementor-active');
                    
                    // Close all other items in the same accordion
                    const accordion = item.closest('.elementor-accordion');
                    if (accordion) {
                        const allItems = accordion.querySelectorAll('.elementor-accordion-item');
                        allItems.forEach(function(otherItem) {
                            if (otherItem !== item) {
                                otherItem.classList.remove('elementor-active');
                                const otherTitle = otherItem.querySelector('.elementor-tab-title');
                                const otherContent = otherItem.querySelector('.elementor-tab-content');
                                if (otherTitle) otherTitle.classList.remove('elementor-active');
                                if (otherContent) {
                                    otherContent.classList.remove('elementor-active');
                                    otherContent.style.display = 'none';
                                }
                            }
                        });
                    }
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('elementor-active');
                        title.classList.remove('elementor-active');
                        content.classList.remove('elementor-active');
                        content.style.display = 'none';
                        title.setAttribute('aria-expanded', 'false');
                    } else {
                        item.classList.add('elementor-active');
                        title.classList.add('elementor-active');
                        content.classList.add('elementor-active');
                        content.style.display = 'block';
                        title.setAttribute('aria-expanded', 'true');
                    }
                });
                
                // Set initial state
                if (title.classList.contains('elementor-active')) {
                    item.classList.add('elementor-active');
                    content.classList.add('elementor-active');
                    content.style.display = 'block';
                    title.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('elementor-active');
                    content.classList.remove('elementor-active');
                    content.style.display = 'none';
                    title.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
    
    // Initialize accordions
    initAccordions();
    
    // Re-initialize if new accordions are added dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (node.classList.contains('elementor-accordion-item') || node.querySelector('.elementor-accordion-item'))) {
                        initAccordions();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

/**
 * Additional CSS for better accordion styling
 */
const accordionCSS = `
<style>
.elementor-accordion-item .elementor-tab-title {
    cursor: pointer;
    transition: all 0.3s ease;
}

.elementor-accordion-item .elementor-tab-title:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.elementor-accordion-item .elementor-tab-content {
    transition: all 0.3s ease;
    overflow: hidden;
}

.elementor-accordion-item:not(.elementor-active) .elementor-tab-content {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.elementor-accordion-item.elementor-active .elementor-tab-content {
    max-height: none;
}

.elementor-accordion-icon-closed,
.elementor-accordion-icon-opened {
    transition: all 0.3s ease;
}

.elementor-accordion-item:not(.elementor-active) .elementor-accordion-icon-opened {
    display: none;
}

.elementor-accordion-item.elementor-active .elementor-accordion-icon-closed {
    display: none;
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML('beforeend', accordionCSS); 