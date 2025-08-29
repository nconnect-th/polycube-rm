/**
 * Enhanced Carousel Navigation JavaScript
 * Adds improved left/right arrow navigation for image carousels
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Carousel Navigation: Initializing...');

    // Force show Smart Slider arrows
    function enhanceSmartSliderArrows() {
        const smartSlider = document.querySelector('#n2-ss-2');
        if (smartSlider) {
            const prevArrow = smartSlider.querySelector('.nextend-arrow-previous');
            const nextArrow = smartSlider.querySelector('.nextend-arrow-next');
            
            if (prevArrow && nextArrow) {
                // Remove hidden classes and ensure visibility
                prevArrow.classList.remove('n2-ss-widget-hidden');
                nextArrow.classList.remove('n2-ss-widget-hidden');
                
                // Force display
                prevArrow.style.display = 'flex';
                nextArrow.style.display = 'flex';
                prevArrow.style.opacity = '1';
                nextArrow.style.opacity = '1';
                prevArrow.style.visibility = 'visible';
                nextArrow.style.visibility = 'visible';
                
                console.log('Enhanced Carousel Navigation: Smart Slider arrows enhanced');
            }
        }
    }

    // Enhance news carousel arrows
    function enhanceNewsCarouselArrows() {
        const newsCarousels = document.querySelectorAll('.bdt-ep-carousel');
        
        newsCarousels.forEach((carousel, index) => {
            const prevButton = carousel.querySelector('.bdt-navigation-prev');
            const nextButton = carousel.querySelector('.bdt-navigation-next');
            
            if (prevButton && nextButton) {
                // Ensure arrows are visible and functional
                prevButton.style.display = 'flex';
                nextButton.style.display = 'flex';
                prevButton.style.opacity = '1';
                nextButton.style.opacity = '1';
                
                // Add click event listeners if not already present
                if (!prevButton.hasAttribute('data-enhanced')) {
                    prevButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        const swiperWrapper = carousel.querySelector('.swiper-wrapper');
                        const swiper = swiperWrapper?.swiper;
                        if (swiper) {
                            swiper.slidePrev();
                        }
                    });
                    prevButton.setAttribute('data-enhanced', 'true');
                }
                
                if (!nextButton.hasAttribute('data-enhanced')) {
                    nextButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        const swiperWrapper = carousel.querySelector('.swiper-wrapper');
                        const swiper = swiperWrapper?.swiper;
                        if (swiper) {
                            swiper.slideNext();
                        }
                    });
                    nextButton.setAttribute('data-enhanced', 'true');
                }
                
                console.log(`Enhanced Carousel Navigation: News carousel ${index + 1} arrows enhanced`);
            }
        });
    }

    // Add keyboard navigation
    function addKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const activeCarousel = document.querySelector('.bdt-ep-carousel:hover, #n2-ss-2:hover');
                if (activeCarousel) {
                    e.preventDefault();
                    
                    if (activeCarousel.id === 'n2-ss-2') {
                        // Smart Slider navigation
                        const arrow = e.key === 'ArrowLeft' ? 
                            activeCarousel.querySelector('.nextend-arrow-previous') :
                            activeCarousel.querySelector('.nextend-arrow-next');
                        if (arrow) arrow.click();
                    } else {
                        // News carousel navigation
                        const arrow = e.key === 'ArrowLeft' ? 
                            activeCarousel.querySelector('.bdt-navigation-prev') :
                            activeCarousel.querySelector('.bdt-navigation-next');
                        if (arrow) arrow.click();
                    }
                }
            }
        });
    }

    // Add touch/swipe support for mobile
    function addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let currentCarousel = null;

        document.addEventListener('touchstart', function(e) {
            const carousel = e.target.closest('.bdt-ep-carousel, #n2-ss-2');
            if (carousel) {
                currentCarousel = carousel;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!currentCarousel) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Check if it's a horizontal swipe (more horizontal than vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                e.preventDefault();
                
                if (currentCarousel.id === 'n2-ss-2') {
                    // Smart Slider navigation
                    const arrow = diffX > 0 ? 
                        currentCarousel.querySelector('.nextend-arrow-next') :
                        currentCarousel.querySelector('.nextend-arrow-previous');
                    if (arrow) arrow.click();
                } else {
                    // News carousel navigation
                    const arrow = diffX > 0 ? 
                        currentCarousel.querySelector('.bdt-navigation-next') :
                        currentCarousel.querySelector('.bdt-navigation-prev');
                    if (arrow) arrow.click();
                }
            }
            
            currentCarousel = null;
        }, { passive: false });
    }

    // Initialize all enhancements
    function initializeEnhancements() {
        enhanceSmartSliderArrows();
        enhanceNewsCarouselArrows();
        addKeyboardNavigation();
        addTouchSupport();
    }

    // Run immediately and after a short delay to ensure all elements are loaded
    initializeEnhancements();
    
    setTimeout(initializeEnhancements, 1000);
    setTimeout(initializeEnhancements, 3000);

    // Re-enhance when new content loads (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                initializeEnhancements();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Enhanced Carousel Navigation: All enhancements initialized');
});