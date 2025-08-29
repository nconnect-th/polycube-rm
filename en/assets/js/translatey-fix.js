/**
 * TranslateY Motion Fix Script
 * แก้ไข translateY ให้หยุดที่ค่า 0 เมื่อ element อยู่ในตำแหน่งที่เหมาะสม
 */
(function() {
    'use strict';

    let isFixed = false;

    function waitForElement() {
        const targetElement = document.querySelector('[data-id="fe6d408"]');
        
        if (targetElement) {
            initTranslateYFix(targetElement);
        } else {
            setTimeout(waitForElement, 100);
        }
    }

    function initTranslateYFix(element) {
        console.log('Initializing translateY fix for element:', element);

        // สร้าง Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -30% 0px', // เริ่มตรวจจับเมื่อ element เข้ามา 70% ในหน้าจอ
            threshold: [0.3, 0.5, 0.7] // ตรวจจับที่หลายระดับ
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !isFixed) {
                    console.log('Element is in optimal position, applying translateY fix');
                    fixTranslateY(entry.target);
                    isFixed = true;
                }
            });
        }, observerOptions);

        observer.observe(element);

        // เพิ่ม scroll listener สำหรับ fine-tuning
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                checkElementPosition(element);
            }, 50);
        });
    }

    function checkElementPosition(element) {
        if (isFixed) return;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // ตรวจสอบว่า element อยู่ในช่วงกลางหน้าจอ (30% ถึง 70% ของหน้าจอ)
        const elementCenter = rect.top + rect.height / 2;
        const screenCenter = windowHeight / 2;
        const tolerance = windowHeight * 0.2; // ระยะผิดพลาดได้ 20% ของหน้าจอ

        if (Math.abs(elementCenter - screenCenter) < tolerance) {
            console.log('Element reached optimal center position');
            fixTranslateY(element);
            isFixed = true;
        }
    }

    function fixTranslateY(element) {
        // เพิ่ม class สำหรับ CSS override
        element.classList.add('motion-settled');
        
        // ใช้ inline style override เพื่อให้แน่ใจ
        element.style.setProperty('--translateY', '0px', 'important');
        element.style.setProperty('transform', 'translateY(0px)', 'important');
        
        console.log('TranslateY fixed to 0px for element:', element);

        // เพิ่ม event listener สำหรับการปรับขนาดหน้าจอ
        window.addEventListener('resize', () => {
            if (isFixed) {
                element.style.setProperty('transform', 'translateY(0px)', 'important');
            }
        });
    }

    // เริ่มต้นเมื่อ DOM โหลดเสร็จ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElement);
    } else {
        waitForElement();
    }

    // เพิ่ม class เมื่อหน้าจอโหลดเสร็จ
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
    });

})();
