/**
 * Vanilla Touch Carousel
 * Pure JavaScript carousel with touch/swipe support
 * No dependencies required - works without webpack
 */
(function() {
    'use strict';

    class VanillaTouchCarousel {
        constructor(container, options = {}) {
            this.container = container;
            this.wrapper = container.querySelector('.swiper-wrapper');
            this.slides = Array.from(container.querySelectorAll('.swiper-slide'));
            this.prevBtn = container.querySelector('.bdt-navigation-prev');
            this.nextBtn = container.querySelector('.bdt-navigation-next');
            
            // Default options
            this.options = {
                slidesPerView: 1,
                spaceBetween: 35,
                speed: 500,
                freeMode: true,
                grabCursor: true,
                breakpoints: {
                    767: { slidesPerView: 2 },
                    1023: { slidesPerView: 3 }
                },
                ...options
            };

            this.currentIndex = 0;
            this.isTransitioning = false;
            this.isDragging = false;
            this.startX = 0;
            this.currentX = 0;
            this.initialTransform = 0;
            this.slideWidth = 0;
            this.maxIndex = 0;

            this.init();
        }

        init() {
            this.setupCarousel();
            this.bindEvents();
            this.updateNavigation();
            console.log('[Vanilla Carousel] Initialized successfully');
        }

        setupCarousel() {
            // Calculate slide dimensions
            this.calculateDimensions();
            
            // Set initial transform
            this.updateTransform(0);
            
            // Add cursor style
            if (this.options.grabCursor) {
                this.wrapper.style.cursor = 'grab';
            }
        }

        calculateDimensions() {
            const containerWidth = this.container.offsetWidth;
            const currentBreakpoint = this.getCurrentBreakpoint();
            const slidesPerView = currentBreakpoint.slidesPerView || this.options.slidesPerView;
            
            this.slideWidth = (containerWidth - (this.options.spaceBetween * (slidesPerView - 1))) / slidesPerView;
            this.maxIndex = Math.max(0, this.slides.length - slidesPerView);
            
            // Update slide styles
            this.slides.forEach((slide, index) => {
                slide.style.width = `${this.slideWidth}px`;
                slide.style.marginRight = index < this.slides.length - 1 ? `${this.options.spaceBetween}px` : '0px';
            });
        }

        getCurrentBreakpoint() {
            const width = window.innerWidth;
            const breakpoints = this.options.breakpoints;
            
            let currentBreakpoint = {};
            Object.keys(breakpoints).forEach(bp => {
                if (width >= parseInt(bp)) {
                    currentBreakpoint = breakpoints[bp];
                }
            });
            
            return currentBreakpoint;
        }

        bindEvents() {
            // Navigation buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }

            // Touch events
            this.wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            this.wrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            this.wrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e));

            // Mouse events for desktop drag
            this.wrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.wrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.wrapper.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.wrapper.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

            // Prevent context menu on long press
            this.wrapper.addEventListener('contextmenu', (e) => {
                if (this.isDragging) e.preventDefault();
            });

            // Resize handler
            window.addEventListener('resize', () => this.handleResize());
        }

        handleTouchStart(e) {
            if (this.isTransitioning) return;
            
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.initialTransform = this.getCurrentTransform();
            this.wrapper.style.cursor = 'grabbing';
            
            e.preventDefault();
        }

        handleTouchMove(e) {
            if (!this.isDragging) return;
            
            this.currentX = e.touches[0].clientX;
            const deltaX = this.currentX - this.startX;
            
            if (this.options.freeMode) {
                this.updateTransform(this.initialTransform + deltaX);
            }
            
            e.preventDefault();
        }

        handleTouchEnd(e) {
            if (!this.isDragging) return;
            
            const deltaX = this.currentX - this.startX;
            const threshold = this.slideWidth * 0.3; // 30% of slide width
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                // Snap back to current position
                this.goToSlide(this.currentIndex);
            }
            
            this.isDragging = false;
            this.wrapper.style.cursor = this.options.grabCursor ? 'grab' : '';
        }

        handleMouseDown(e) {
            if (this.isTransitioning) return;
            
            this.isDragging = true;
            this.startX = e.clientX;
            this.initialTransform = this.getCurrentTransform();
            this.wrapper.style.cursor = 'grabbing';
            
            e.preventDefault();
        }

        handleMouseMove(e) {
            if (!this.isDragging) return;
            
            this.currentX = e.clientX;
            const deltaX = this.currentX - this.startX;
            
            if (this.options.freeMode) {
                this.updateTransform(this.initialTransform + deltaX);
            }
        }

        handleMouseUp(e) {
            if (!this.isDragging) return;
            
            const deltaX = this.currentX - this.startX;
            const threshold = this.slideWidth * 0.3;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                this.goToSlide(this.currentIndex);
            }
            
            this.isDragging = false;
            this.wrapper.style.cursor = this.options.grabCursor ? 'grab' : '';
        }

        handleResize() {
            this.calculateDimensions();
            this.goToSlide(this.currentIndex);
        }

        getCurrentTransform() {
            const style = window.getComputedStyle(this.wrapper);
            const matrix = style.transform || style.webkitTransform || style.mozTransform;
            
            if (matrix === 'none') return 0;
            
            const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
            return parseFloat(matrixValues[4]) || 0;
        }

        updateTransform(translateX) {
            // Constrain transform to valid range
            const maxTranslate = 0;
            const minTranslate = -(this.slides.length - this.getCurrentBreakpoint().slidesPerView || this.options.slidesPerView) * (this.slideWidth + this.options.spaceBetween);
            
            translateX = Math.min(maxTranslate, Math.max(minTranslate, translateX));
            
            this.wrapper.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
        }

        goToSlide(index, smooth = true) {
            if (this.isTransitioning) return;
            
            index = Math.max(0, Math.min(index, this.maxIndex));
            this.currentIndex = index;
            
            const translateX = -index * (this.slideWidth + this.options.spaceBetween);
            
            if (smooth) {
                this.isTransitioning = true;
                this.wrapper.style.transition = `transform ${this.options.speed}ms ease-out`;
                
                setTimeout(() => {
                    this.isTransitioning = false;
                    this.wrapper.style.transition = '';
                }, this.options.speed);
            }
            
            this.updateTransform(translateX);
            this.updateNavigation();
            this.updateSlideStates();
        }

        nextSlide() {
            this.goToSlide(this.currentIndex + 1);
        }

        prevSlide() {
            this.goToSlide(this.currentIndex - 1);
        }

        updateNavigation() {
            if (this.prevBtn) {
                this.prevBtn.classList.toggle('swiper-button-disabled', this.currentIndex === 0);
                this.prevBtn.setAttribute('aria-disabled', this.currentIndex === 0);
            }
            
            if (this.nextBtn) {
                this.nextBtn.classList.toggle('swiper-button-disabled', this.currentIndex === this.maxIndex);
                this.nextBtn.setAttribute('aria-disabled', this.currentIndex === this.maxIndex);
            }
        }

        updateSlideStates() {
            this.slides.forEach((slide, index) => {
                slide.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev');
                
                if (index === this.currentIndex) {
                    slide.classList.add('swiper-slide-active');
                } else if (index === this.currentIndex + 1) {
                    slide.classList.add('swiper-slide-next');
                } else if (index === this.currentIndex - 1) {
                    slide.classList.add('swiper-slide-prev');
                }
            });
        }
    }

    // Initialize carousel when DOM is ready
    function initCarousels() {
        const carousels = document.querySelectorAll('.bdt-ep-carousel');
        
        carousels.forEach(carousel => {
            // Parse data-settings
            const settingsAttr = carousel.getAttribute('data-settings');
            let settings = {};
            
            try {
                settings = JSON.parse(settingsAttr.replace(/&quot;/g, '"'));
            } catch (e) {
                console.warn('[Vanilla Carousel] Could not parse settings:', e);
            }
            
            // Create carousel instance
            new VanillaTouchCarousel(carousel, settings);
        });
        
        console.log(`[Vanilla Carousel] Initialized ${carousels.length} carousel(s)`);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }

    // Export for manual initialization if needed
    window.VanillaTouchCarousel = VanillaTouchCarousel;

})();
