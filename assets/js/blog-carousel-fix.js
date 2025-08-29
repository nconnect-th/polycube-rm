/**
 * Enhanced Carousel Fix for Blog Category Carousels
 * เพิ่มการจัดการ carousel สำหรับ category-blog เฉพาะ
 */

class BlogCarouselFix {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initBlogCarousels());
        } else {
            this.initBlogCarousels();
        }
    }

    initBlogCarousels() {
        console.log('Initializing Blog Carousel Fix...');
        
        // หา carousel ที่มี blog items
        const blogCarousels = document.querySelectorAll('.bdt-ep-carousel');
        
        blogCarousels.forEach(carousel => {
            const blogItems = carousel.querySelectorAll('.category-blog');
            if (blogItems.length > 0) {
                console.log(`Found blog carousel with ${blogItems.length} items`);
                this.fixBlogCarousel(carousel);
            }
        });

        // หา carousel ที่มี ID เฉพาะ
        const specificCarousel = document.querySelector('#bdt-carousel-f5a2fe7');
        if (specificCarousel) {
            console.log('Found specific carousel: bdt-carousel-f5a2fe7');
            this.fixBlogCarousel(specificCarousel);
        }
    }

    fixBlogCarousel(carouselElement) {
        const swiperContainer = carouselElement.querySelector('.swiper-carousel, .swiper');
        const wrapper = carouselElement.querySelector('.swiper-wrapper');
        const slides = carouselElement.querySelectorAll('.swiper-slide');
        const nextBtn = carouselElement.querySelector('.bdt-navigation-next');
        const prevBtn = carouselElement.querySelector('.bdt-navigation-prev');

        if (!wrapper || slides.length === 0) {
            console.warn('No valid carousel structure found');
            return;
        }

        console.log(`Setting up carousel with ${slides.length} slides`);

        // กำหนดค่าเริ่มต้น
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slidesPerView = this.getSlidesPerView();
        let isAnimating = false;

        // อัพเดท slidesPerView เมื่อหน้าจอเปลี่ยนขนาด
        window.addEventListener('resize', () => {
            slidesPerView = this.getSlidesPerView();
            this.updateCarousel();
        });

        // ฟังก์ชันอัพเดท carousel
        const updateCarousel = () => {
            if (isAnimating) return;
            
            isAnimating = true;
            
            // คำนวณการเลื่อน
            const slideWidth = 100 / slidesPerView;
            const maxSlide = Math.max(0, totalSlides - slidesPerView);
            
            // จำกัดค่า currentSlide
            currentSlide = Math.max(0, Math.min(currentSlide, maxSlide));
            
            const translateX = -(currentSlide * slideWidth);
            
            // ใช้ CSS transform
            wrapper.style.transition = 'transform 0.5s ease-in-out';
            wrapper.style.transform = `translateX(${translateX}%)`;
            
            // อัพเดทสถานะปุ่ม
            this.updateButtonStates(currentSlide, maxSlide, prevBtn, nextBtn);
            
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        };

        // ฟังก์ชันนำทาง
        const navigate = (direction) => {
            if (isAnimating) return;
            
            if (direction === 'next') {
                const maxSlide = Math.max(0, totalSlides - slidesPerView);
                if (currentSlide < maxSlide) {
                    currentSlide++;
                    updateCarousel();
                }
            } else if (direction === 'prev') {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarousel();
                }
            }
        };

        // เซตอัพ carousel structure
        this.setupCarouselStructure(wrapper, slides, slidesPerView);
        
        // เพิ่ม event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigate('next');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigate('prev');
            });
        }

        // เรียก updateCarousel ครั้งแรก
        updateCarousel();

        // เพิ่ม touch/swipe support
        this.addTouchSupport(wrapper, navigate);

        console.log('Blog carousel setup completed');
    }

    getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    }

    setupCarouselStructure(wrapper, slides, slidesPerView) {
        // ตั้งค่า wrapper
        wrapper.style.display = 'flex';
        wrapper.style.width = '100%';
        wrapper.style.overflow = 'visible';

        // ตั้งค่าแต่ละ slide
        slides.forEach((slide, index) => {
            slide.style.flex = `0 0 ${100 / slidesPerView}%`;
            slide.style.minWidth = '0';
            slide.style.boxSizing = 'border-box';
            
            // เก็บ margin-right ที่มีอยู่
            const currentMargin = slide.style.marginRight || '35px';
            slide.style.marginRight = currentMargin;
        });
    }

    updateButtonStates(currentSlide, maxSlide, prevBtn, nextBtn) {
        if (prevBtn) {
            if (currentSlide <= 0) {
                prevBtn.classList.add('swiper-button-disabled');
                prevBtn.setAttribute('aria-disabled', 'true');
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
            } else {
                prevBtn.classList.remove('swiper-button-disabled');
                prevBtn.setAttribute('aria-disabled', 'false');
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
        }

        if (nextBtn) {
            if (currentSlide >= maxSlide) {
                nextBtn.classList.add('swiper-button-disabled');
                nextBtn.setAttribute('aria-disabled', 'true');
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
            } else {
                nextBtn.classList.remove('swiper-button-disabled');
                nextBtn.setAttribute('aria-disabled', 'false');
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }
    }

    addTouchSupport(wrapper, navigate) {
        let startX = 0;
        let startY = 0;
        let isTouch = false;

        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isTouch = true;
        });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isTouch) return;
            e.preventDefault(); // ป้องกันการ scroll
        }, { passive: false });

        wrapper.addEventListener('touchend', (e) => {
            if (!isTouch) return;
            isTouch = false;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // ตรวจสอบว่าเป็นการ swipe แนวนอน
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    navigate('next');
                } else {
                    navigate('prev');
                }
            }
        });
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    new BlogCarouselFix();
    console.log('Blog Carousel Fix initialized');
});

// Initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    new BlogCarouselFix();
}

// Export for global access
window.BlogCarouselFix = BlogCarouselFix;
