/**
 * Swiper Carousel Fix
 * แก้ไขปัญหา Swiper carousel ที่ไม่สามารถ swipe ได้
 */
(function() {
    'use strict';

    // รอให้ DOM และ Swiper library โหลดเสร็จ
    function initSwiperFix() {
        // ตรวจสอบว่า Swiper library โหลดแล้วหรือไม่
        if (typeof Swiper === 'undefined' && typeof window.Swiper === 'undefined') {
            // ลองอีกครั้งหลัง 100ms
            setTimeout(initSwiperFix, 100);
            return;
        }

        console.log('[Swiper Fix] Swiper library detected, initializing fixes...');

        // ค้นหา carousel ที่มีปัญหา
        const carouselElement = document.querySelector('#bdt-carousel-f5a2fe7 .swiper-carousel');
        const carouselContainer = document.querySelector('#bdt-carousel-f5a2fe7');
        
        if (!carouselElement || !carouselContainer) {
            console.warn('[Swiper Fix] Carousel elements not found');
            return;
        }

        // ตรวจสอบว่า carousel มี swiper instance หรือไม่
        let swiperInstance = carouselElement.swiper;

        if (swiperInstance) {
            console.log('[Swiper Fix] Existing Swiper instance found, updating...');
            
            // Update Swiper parameters
            swiperInstance.allowTouchMove = true;
            swiperInstance.allowSlideNext = true;
            swiperInstance.allowSlidePrev = true;
            
            // Enable touch events
            swiperInstance.params.touchStartPreventDefault = false;
            swiperInstance.params.touchMoveStopPropagation = false;
            swiperInstance.params.simulateTouch = true;
            swiperInstance.params.grabCursor = true;
            swiperInstance.params.freeMode = {
                enabled: true,
                sticky: false,
                momentum: true,
                momentumRatio: 1,
                momentumBounce: true,
                momentumBounceRatio: 1,
                momentumVelocityRatio: 1,
                minimumVelocity: 0.02
            };

            // Re-enable touch events
            swiperInstance.enable();
            swiperInstance.update();
            
            console.log('[Swiper Fix] ✅ Existing Swiper updated');
        } else {
            console.log('[Swiper Fix] No existing instance, creating new Swiper...');
            
            // สร้าง Swiper instance ใหม่
            const SwiperClass = window.Swiper || Swiper;
            
            const swiperConfig = {
                // Basic settings
                direction: 'horizontal',
                loop: false,
                speed: 500,
                
                // Slides settings
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 35,
                
                // Touch settings
                allowTouchMove: true,
                grabCursor: true,
                touchStartPreventDefault: false,
                touchMoveStopPropagation: false,
                simulateTouch: true,
                
                // Free mode settings
                freeMode: {
                    enabled: true,
                    sticky: false,
                    momentum: true,
                    momentumRatio: 1,
                    momentumBounce: true,
                    momentumBounceRatio: 1,
                    momentumVelocityRatio: 1,
                    minimumVelocity: 0.02
                },
                
                // Responsive breakpoints
                breakpoints: {
                    767: {
                        slidesPerView: 2,
                        spaceBetween: 35,
                        slidesPerGroup: 1
                    },
                    1023: {
                        slidesPerView: 3,
                        spaceBetween: 35,
                        slidesPerGroup: 1
                    }
                },
                
                // Navigation
                navigation: {
                    nextEl: '#bdt-carousel-f5a2fe7 .bdt-navigation-next',
                    prevEl: '#bdt-carousel-f5a2fe7 .bdt-navigation-prev'
                },
                
                // Events
                on: {
                    init: function() {
                        console.log('[Swiper Fix] ✅ New Swiper initialized successfully');
                    },
                    touchStart: function() {
                        console.log('[Swiper Fix] Touch start detected');
                    },
                    touchMove: function() {
                        console.log('[Swiper Fix] Touch move detected');
                    }
                }
            };
            
            // สร้าง Swiper instance ใหม่
            swiperInstance = new SwiperClass(carouselElement, swiperConfig);
        }

        // เพิ่ม CSS เสริมเพื่อให้แน่ใจว่า touch events ทำงาน
        const style = document.createElement('style');
        style.textContent = `
            #bdt-carousel-f5a2fe7 .swiper-carousel {
                touch-action: pan-y pinch-zoom !important;
                -ms-touch-action: pan-y pinch-zoom !important;
            }
            
            #bdt-carousel-f5a2fe7 .swiper-wrapper {
                touch-action: pan-y pinch-zoom !important;
                -ms-touch-action: pan-y pinch-zoom !important;
                cursor: grab !important;
            }
            
            #bdt-carousel-f5a2fe7 .swiper-wrapper:active {
                cursor: grabbing !important;
            }
            
            #bdt-carousel-f5a2fe7 .swiper-slide {
                user-select: none;
                -webkit-user-select: none;
                pointer-events: auto !important;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                #bdt-carousel-f5a2fe7 .swiper-carousel {
                    touch-action: pan-x pan-y !important;
                    -ms-touch-action: pan-x pan-y !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Force touch capability detection
        if (swiperInstance && swiperInstance.support) {
            swiperInstance.support.touch = true;
            swiperInstance.support.pointerEvents = true;
        }

        console.log('[Swiper Fix] ✅ Swiper carousel fix applied successfully');
    }

    // เริ่มต้นเมื่อ DOM โหลดเสร็จ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwiperFix);
    } else {
        // DOM โหลดเสร็จแล้ว ลองเริ่มทันที
        initSwiperFix();
    }

    // รอให้ Element Pack และ Swiper โหลดเสร็จ
    setTimeout(initSwiperFix, 1000);

    // Global function สำหรับ manual fix
    window.fixSwiperCarousel = function() {
        initSwiperFix();
    };

})();
