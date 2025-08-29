/**
 * Enhanced Blog Carousel JavaScript Fix
 * แก้ไขปัญหา carousel ที่แสดงแค่บทความเดียว
 */

class BlogCarouselEnhancer {
    constructor() {
        this.carouselId = 'bdt-carousel-f5a2fe7';
        this.currentSlide = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.init();
    }

    init() {
        console.log('🚀 เริ่มต้น Blog Carousel Enhancer...');
        
        // รอให้ DOM โหลดเสร็จ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCarousel());
        } else {
            this.setupCarousel();
        }

        // ตั้งค่า resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    setupCarousel() {
        const carousel = document.getElementById(this.carouselId);
        if (!carousel) {
            console.warn('❌ ไม่พบ carousel element:', this.carouselId);
            return;
        }

        console.log('✅ พบ carousel element:', carousel);

        // เพิ่ม enhanced class
        carousel.classList.add('blog-carousel-enhanced');

        // ตั้งค่า slides
        this.setupSlides();

        // ตั้งค่า navigation
        this.setupNavigation();

        // เริ่มต้น carousel
        this.updateCarousel();

        console.log('🎉 Blog Carousel Enhanced setup เสร็จสิ้น!');
    }

    setupSlides() {
        const wrapper = document.querySelector(`#${this.carouselId} .swiper-wrapper`);
        const slides = document.querySelectorAll(`#${this.carouselId} .bdt-ep-carousel-item`);
        
        if (!wrapper || slides.length === 0) {
            console.warn('❌ ไม่พบ wrapper หรือ slides');
            return;
        }

        console.log(`📋 พบ ${slides.length} slides`);

        // แก้ไข wrapper styles
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'stretch';
        wrapper.style.transition = 'transform 0.3s ease';

        // ตั้งค่า slides
        slides.forEach((slide, index) => {
            slide.style.flexShrink = '0';
            slide.style.opacity = '1';
            slide.style.transform = 'none';
            
            // ตั้งค่า width ตาม responsive
            this.updateSlideWidth(slide);

            console.log(`✅ ตั้งค่า slide ${index + 1} เสร็จสิ้น`);
        });

        this.totalSlides = slides.length;
    }

    setupNavigation() {
        const prevBtn = document.querySelector(`#${this.carouselId} .bdt-navigation-prev`);
        const nextBtn = document.querySelector(`#${this.carouselId} .bdt-navigation-next`);

        if (!prevBtn || !nextBtn) {
            console.warn('❌ ไม่พบ navigation buttons');
            return;
        }

        // ลบ event listeners เดิม
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        nextBtn.replaceWith(nextBtn.cloneNode(true));

        // ใช้ reference ใหม่
        const newPrevBtn = document.querySelector(`#${this.carouselId} .bdt-navigation-prev`);
        const newNextBtn = document.querySelector(`#${this.carouselId} .bdt-navigation-next`);

        // เพิ่ม event listeners ใหม่
        newPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.prevSlide();
        });

        newNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });

        console.log('✅ ตั้งค่า navigation เสร็จสิ้น');
    }

    getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 767) return 1;
        if (width <= 1023) return 2;
        return 3;
    }

    updateSlideWidth(slide) {
        const slidesPerView = this.getSlidesPerView();
        const margin = slidesPerView > 1 ? 35 : 0;
        const widthPercentage = (100 / slidesPerView);
        const marginAdjustment = margin * (slidesPerView - 1) / slidesPerView;
        
        slide.style.width = `calc(${widthPercentage}% - ${marginAdjustment}px)`;
        slide.style.marginRight = slidesPerView > 1 ? '35px' : '0';
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
            console.log(`⬅️ ไป slide ${this.currentSlide + 1}`);
        }
    }

    nextSlide() {
        const maxSlide = Math.max(0, this.totalSlides - this.slidesPerView);
        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
            this.updateCarousel();
            console.log(`➡️ ไป slide ${this.currentSlide + 1}`);
        }
    }

    updateCarousel() {
        const wrapper = document.querySelector(`#${this.carouselId} .swiper-wrapper`);
        const prevBtn = document.querySelector(`#${this.carouselId} .bdt-navigation-prev`);
        const nextBtn = document.querySelector(`#${this.carouselId} .bdt-navigation-next`);

        if (!wrapper) return;

        // คำนวณ transform
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentSlide * slideWidth);
        
        wrapper.style.transform = `translate3d(${translateX}%, 0px, 0px)`;

        // อัพเดท navigation buttons
        if (prevBtn) {
            if (this.currentSlide === 0) {
                prevBtn.classList.add('swiper-button-disabled');
                prevBtn.style.opacity = '0.5';
                prevBtn.style.pointerEvents = 'none';
            } else {
                prevBtn.classList.remove('swiper-button-disabled');
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'all';
            }
        }

        if (nextBtn) {
            const maxSlide = Math.max(0, this.totalSlides - this.slidesPerView);
            if (this.currentSlide >= maxSlide) {
                nextBtn.classList.add('swiper-button-disabled');
                nextBtn.style.opacity = '0.5';
                nextBtn.style.pointerEvents = 'none';
            } else {
                nextBtn.classList.remove('swiper-button-disabled');
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'all';
            }
        }
    }

    handleResize() {
        const newSlidesPerView = this.getSlidesPerView();
        if (newSlidesPerView !== this.slidesPerView) {
            this.slidesPerView = newSlidesPerView;
            
            // อัพเดท slide widths
            const slides = document.querySelectorAll(`#${this.carouselId} .bdt-ep-carousel-item`);
            slides.forEach(slide => this.updateSlideWidth(slide));

            // รีเซ็ต current slide ถ้าจำเป็น
            const maxSlide = Math.max(0, this.totalSlides - this.slidesPerView);
            if (this.currentSlide > maxSlide) {
                this.currentSlide = maxSlide;
            }

            this.updateCarousel();
            console.log(`📱 Resize: slidesPerView = ${this.slidesPerView}`);
        }
    }

    // เพิ่ม fallback กรณี Swiper ไม่ทำงาน
    createFallback() {
        const carousel = document.getElementById(this.carouselId);
        if (!carousel) return;

        carousel.classList.add('blog-carousel-fallback');
        
        const wrapper = document.querySelector(`#${this.carouselId} .swiper-wrapper`);
        if (wrapper) {
            wrapper.style.display = 'flex';
            wrapper.style.flexWrap = 'wrap';
            wrapper.style.gap = '35px';
            wrapper.style.justifyContent = 'space-between';
        }

        console.log('🔄 ใช้ fallback carousel layout');
    }
}

// เริ่มต้น carousel enhancer
document.addEventListener('DOMContentLoaded', () => {
    // รอสักครู่ให้ระบบอื่นๆ โหลดก่อน
    setTimeout(() => {
        try {
            new BlogCarouselEnhancer();
        } catch (error) {
            console.error('❌ Blog Carousel Enhancer Error:', error);
            
            // ใช้ fallback
            const enhancer = new BlogCarouselEnhancer();
            enhancer.createFallback();
        }
    }, 1000);
});

// เพิ่ม global function สำหรับ debug
window.debugBlogCarousel = function() {
    const carousel = document.getElementById('bdt-carousel-f5a2fe7');
    const slides = document.querySelectorAll('#bdt-carousel-f5a2fe7 .bdt-ep-carousel-item');
    
    console.log('🔍 Blog Carousel Debug Info:');
    console.log('Carousel element:', carousel);
    console.log('Total slides:', slides.length);
    console.log('Slides per view:', window.innerWidth <= 767 ? 1 : window.innerWidth <= 1023 ? 2 : 3);
    
    slides.forEach((slide, index) => {
        console.log(`Slide ${index + 1}:`, slide.querySelector('.bdt-ep-carousel-title a')?.textContent);
    });
};
