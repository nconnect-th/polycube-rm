/**
 * Services Section Motion Fix
 * แก้ไข Motion Effects สำหรับส่วนบริการของเรา (3 การ์ด)
 * เปลี่ยนจาก translateX: ±250px และ translateY: 200px เป็น 0 เมื่อเลื่อนหน้าจอและค้างไว้
 */
(function() {
    'use strict';

    // รอให้ DOM และ Elementor โหลดเสร็จ
    function waitForElementor() {
        // ตรวจสอบว่า elements ที่ต้องการมีอยู่หรือไม่
        const leftCard = document.querySelector('[data-id="0dbbb11"]');
        const centerCard = document.querySelector('[data-id="b09724b"]'); 
        const rightCard = document.querySelector('[data-id="3162bbd"]');
        
        if (leftCard && centerCard && rightCard) {
            initServicesMotion();
        } else {
            // ลองอีกครั้งหลัง 100ms
            setTimeout(waitForElementor, 100);
        }
    }

    // เริ่มต้นเมื่อ DOM โหลดเสร็จ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElementor);
    } else {
        // DOM โหลดเสร็จแล้ว
        waitForElementor();
    }

    function initServicesMotion() {
        // ค้นหา elements ที่ต้องการปรับ animation
        const motionElements = {
            leftCard: document.querySelector('[data-id="0dbbb11"]'), // การ์ดซ้าย (-250px)
            centerCard: document.querySelector('[data-id="b09724b"]'), // การ์ดกลาง (translateY)
            rightCard: document.querySelector('[data-id="3162bbd"]')   // การ์ดขวา (+250px)
        };

        // ตรวจสอบว่าพบ elements ทั้งหมดหรือไม่
        if (!motionElements.leftCard || !motionElements.centerCard || !motionElements.rightCard) {
            console.warn('Services motion elements not found');
            return;
        }

        // สร้าง Intersection Observer สำหรับตรวจจับการเลื่อนเข้ามาในหน้าจอ
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20% 0px', // เริ่ม animation เมื่อ element เข้ามา 80% ในหน้าจอ
            threshold: 0.3 // เมื่อเห็น element 30% จะเริ่ม animation
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // เมื่อเข้ามาในหน้าจอ ให้ animate เป็น 0 แล้วค้างไว้
                    animateToZero(entry.target);
                    // หยุดสังเกตการณ์ element นี้เพราะ animation เสร็จแล้ว
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // ฟังก์ชัน animate element ไปที่ตำแหน่ง 0 และค้างไว้
        function animateToZero(element) {
            const elementId = element.getAttribute('data-id');
            
            // เพิ่ม class สำหรับ CSS transition
            element.classList.add('motion-animating');
            
            switch (elementId) {
                case '0dbbb11': // การ์ดซ้าย
                    // เปลี่ยนจาก -250px เป็น 0px
                    element.style.setProperty('--translateX', '0px');
                    console.log('Left card animation: -250px → 0px');
                    break;
                
                case 'b09724b': // การ์ดกลาง
                    // เปลี่ยนจาก 200px เป็น 0px
                    element.style.setProperty('--translateY', '0px');
                    console.log('Center card animation: 200px → 0px');
                    break;
                
                case '3162bbd': // การ์ดขวา
                    // เปลี่ยนจาก 250px เป็น 0px
                    element.style.setProperty('--translateX', '0px');
                    console.log('Right card animation: 250px → 0px');
                    break;
            }

            // หลัง animation เสร็จ เพิ่ม class complete
            setTimeout(() => {
                element.classList.remove('motion-animating');
                element.classList.add('motion-complete');
                console.log(`Element ${elementId} animation completed`);
            }, 600); // 600ms ตรงกับ transition ใน CSS
        }

        // เริ่มสังเกตการณ์ elements
        Object.values(motionElements).forEach(element => {
            if (element) {
                observer.observe(element);
            }
        });

        console.log('Services motion effects initialized successfully');
        console.log('Elements found:', {
            leftCard: !!motionElements.leftCard,
            centerCard: !!motionElements.centerCard, 
            rightCard: !!motionElements.rightCard
        });
    }

    // ฟังก์ชันสำหรับรีเซ็ต motion effects (สำหรับการใช้งานภายหลัง)
    window.resetServicesMotion = function() {
        const elements = [
            document.querySelector('[data-id="0dbbb11"]'),
            document.querySelector('[data-id="b09724b"]'), 
            document.querySelector('[data-id="3162bbd"]')
        ];

        elements.forEach(element => {
            if (element) {
                const elementId = element.getAttribute('data-id');
                switch (elementId) {
                    case '0dbbb11':
                        element.style.setProperty('--translateX', '-250px');
                        break;
                    case 'b09724b':
                        element.style.setProperty('--translateY', '200px');
                        break;
                    case '3162bbd':
                        element.style.setProperty('--translateX', '250px');
                        break;
                }
            }
        });
    };

})();
