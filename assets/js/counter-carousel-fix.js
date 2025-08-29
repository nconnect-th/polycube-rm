/**
 * Counter and Carousel Fix
 * This script fixes counter animations and carousel functionality without using webpack
 */

// Counter Animation Fix
class PolycubeCounter {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initCounters());
        } else {
            this.initCounters();
        }
    }

    initCounters() {
        const counters = document.querySelectorAll('.elementor-counter-number[data-to-value]');
        
        if (counters.length === 0) {
            console.log('No counters found on this page');
            return;
        }

        // Set up intersection observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const toValue = parseFloat(element.getAttribute('data-to-value'));
        const fromValue = parseFloat(element.getAttribute('data-from-value') || '0');
        const duration = parseInt(element.getAttribute('data-duration') || '2000');
        const delimiter = element.getAttribute('data-delimiter') || '';
        
        let startTime = null;
        const startValue = fromValue;
        const endValue = toValue;
        const diff = endValue - startValue;

        const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (diff * easeOutQuart);
            
            // Format the number with delimiter if specified
            let displayValue = currentValue;
            if (delimiter === ',') {
                displayValue = this.formatNumber(currentValue, toValue);
            } else {
                displayValue = Math.round(currentValue * 100) / 100;
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is set correctly
                if (delimiter === ',') {
                    element.textContent = this.formatNumber(toValue, toValue);
                } else {
                    element.textContent = toValue;
                }
            }
        };

        requestAnimationFrame(animate);
    }

    formatNumber(value, finalValue) {
        // Determine if the final value has decimals
        const hasDecimals = finalValue % 1 !== 0;
        const rounded = hasDecimals ? Math.round(value * 100) / 100 : Math.round(value);
        return rounded.toLocaleString();
    }
}

// Carousel Fix for BDT Carousel (Element Pack)
class PolycubeCarousel {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initCarousels());
        } else {
            this.initCarousels();
        }
    }

    initCarousels() {
        // Fix for BDT Carousel
        const bdtCarousels = document.querySelectorAll('[id^="bdt-carousel-"]');
        bdtCarousels.forEach(carousel => this.initBDTCarousel(carousel));

        // Fix for regular Swiper carousels
        const swiperContainers = document.querySelectorAll('.swiper-container, .swiper');
        swiperContainers.forEach(container => this.initSwiperCarousel(container));
    }

    initBDTCarousel(carouselElement) {
        try {
            const settingsAttr = carouselElement.getAttribute('data-settings');
            if (!settingsAttr) return;

            let settings;
            try {
                // Parse the HTML-encoded JSON
                const decodedSettings = settingsAttr
                    .replace(/&quot;/g, '"')
                    .replace(/&gt;/g, '>')
                    .replace(/&lt;/g, '<')
                    .replace(/&amp;/g, '&');
                settings = JSON.parse(decodedSettings);
            } catch (e) {
                console.warn('Failed to parse carousel settings:', e);
                return;
            }

            // Create a simple fallback carousel if Swiper is not available
            if (typeof Swiper === 'undefined') {
                this.createFallbackCarousel(carouselElement, settings);
            } else {
                this.initSwiper(carouselElement, settings);
            }
        } catch (error) {
            console.warn('Failed to initialize BDT carousel:', error);
        }
    }

    initSwiperCarousel(container) {
        if (typeof Swiper === 'undefined') {
            this.createSimpleFallback(container);
            return;
        }

        // Basic Swiper initialization
        const swiper = new Swiper(container, {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: container.querySelector('.bdt-navigation-next, .swiper-button-next'),
                prevEl: container.querySelector('.bdt-navigation-prev, .swiper-button-prev'),
            },
            pagination: {
                el: container.querySelector('.swiper-pagination'),
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    initSwiper(element, settings) {
        const swiperContainer = element.querySelector('.swiper-container, .swiper');
        if (!swiperContainer) return;

        const swiperSettings = {
            slidesPerView: settings.slidesPerView || 1,
            spaceBetween: settings.spaceBetween || 20,
            speed: settings.speed || 500,
            grabCursor: settings.grabCursor || true,
            ...settings
        };

        // Add navigation if specified
        if (settings.navigation) {
            swiperSettings.navigation = {
                nextEl: settings.navigation.nextEl,
                prevEl: settings.navigation.prevEl,
            };
        }

        // Add pagination if specified
        if (settings.pagination) {
            swiperSettings.pagination = {
                el: settings.pagination.el,
                clickable: settings.pagination.clickable || true,
            };
        }

        new Swiper(swiperContainer, swiperSettings);
    }

    createFallbackCarousel(element, settings) {
        const wrapper = element.querySelector('.swiper-wrapper');
        const slides = element.querySelectorAll('.swiper-slide');
        
        if (!wrapper || slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        const slidesPerView = settings.slidesPerView || 1;

        // Set up basic styling
        wrapper.style.display = 'flex';
        wrapper.style.transition = 'transform 0.3s ease';
        wrapper.style.width = `${(totalSlides / slidesPerView) * 100}%`;

        slides.forEach(slide => {
            slide.style.flex = `0 0 ${100 / slidesPerView}%`;
        });

        // Navigation function
        const navigate = (direction) => {
            if (direction === 'next' && currentSlide < totalSlides - slidesPerView) {
                currentSlide++;
            } else if (direction === 'prev' && currentSlide > 0) {
                currentSlide--;
            }
            
            const translateX = -(currentSlide * (100 / slidesPerView));
            wrapper.style.transform = `translateX(${translateX}%)`;
        };

        // Add navigation event listeners
        const nextBtn = element.querySelector('.bdt-navigation-next');
        const prevBtn = element.querySelector('.bdt-navigation-prev');

        if (nextBtn) nextBtn.addEventListener('click', () => navigate('next'));
        if (prevBtn) prevBtn.addEventListener('click', () => navigate('prev'));

        // Auto-play if enabled
        if (settings.autoplay && settings.autoplay.enabled) {
            setInterval(() => {
                if (currentSlide >= totalSlides - slidesPerView) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
                const translateX = -(currentSlide * (100 / slidesPerView));
                wrapper.style.transform = `translateX(${translateX}%)`;
            }, settings.autoplay.duration || 3000);
        }
    }

    createSimpleFallback(container) {
        const slides = container.querySelectorAll('.swiper-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        
        // Hide all slides except the first
        slides.forEach((slide, index) => {
            slide.style.display = index === 0 ? 'block' : 'none';
        });

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        };

        // Simple navigation
        const nextBtn = container.querySelector('.swiper-button-next, .bdt-navigation-next');
        const prevBtn = container.querySelector('.swiper-button-prev, .bdt-navigation-prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter fix
    new PolycubeCounter();
    
    // Initialize carousel fix
    new PolycubeCarousel();
    
    console.log('Polycube Counter and Carousel fixes initialized');
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    new PolycubeCounter();
    new PolycubeCarousel();
    console.log('Polycube Counter and Carousel fixes initialized immediately');
}

// Export for global access
window.PolycubeCounter = PolycubeCounter;
window.PolycubeCarousel = PolycubeCarousel;
