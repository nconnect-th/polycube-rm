/**
 * Combined Motion Fix Script (TranslateX + TranslateY)
 * แก้ไขทั้ง translateX และ translateY ให้หยุดที่ค่า 0 พร้อมกัน
 */
(function() {
    'use strict';

    const motionElements = {
        translateY: null,
        translateX: null
    };
    
    let fixStatus = {
        translateY: false,
        translateX: false
    };

    function waitForElements() {
        motionElements.translateY = document.querySelector('[data-id="fe6d408"]');
        motionElements.translateX = document.querySelector('[data-id="b624290"]');
        
        if (motionElements.translateY && motionElements.translateX) {
            initCombinedMotionFix();
        } else {
            setTimeout(waitForElements, 100);
        }
    }

    function initCombinedMotionFix() {
        console.log('Initializing combined motion fix for both translateX and translateY');

        // สร้าง Intersection Observer สำหรับทั้งคู่
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20% 0px',
            threshold: [0.3, 0.5, 0.7]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const elementId = entry.target.getAttribute('data-id');
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    if (elementId === 'fe6d408' && !fixStatus.translateY) {
                        console.log('Applying translateY fix');
                        fixTransform(entry.target, 'translateY');
                        fixStatus.translateY = true;
                    } else if (elementId === 'b624290' && !fixStatus.translateX) {
                        console.log('Applying translateX fix');
                        fixTransform(entry.target, 'translateX');
                        fixStatus.translateX = true;
                    }
                }
            });
        }, observerOptions);

        // Observe ทั้งสอง elements
        observer.observe(motionElements.translateY);
        observer.observe(motionElements.translateX);

        // เพิ่ม scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                checkElementsPosition();
            }, 50);
        });
    }

    function checkElementsPosition() {
        Object.entries(motionElements).forEach(([type, element]) => {
            if (!element || fixStatus[type]) return;

            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const elementCenter = rect.top + rect.height / 2;
            const screenCenter = windowHeight / 2;
            const tolerance = windowHeight * 0.25;

            if (Math.abs(elementCenter - screenCenter) < tolerance) {
                console.log(`Element reached optimal position for ${type}`);
                fixTransform(element, type);
                fixStatus[type] = true;
            }
        });
    }

    function fixTransform(element, transformType) {
        const cssVar = `--${transformType}`;
        const transformFunction = `${transformType}(0px)`;
        
        // เพิ่ม class สำหรับ CSS override
        element.classList.add('motion-settled');
        
        // ใช้ inline style override
        element.style.setProperty(cssVar, '0px', 'important');
        element.style.setProperty('transform', transformFunction, 'important');
        
        // ลบ motion effects ออกจาก data-settings
        try {
            const currentSettings = element.getAttribute('data-settings');
            if (currentSettings) {
                const settings = JSON.parse(currentSettings.replace(/&quot;/g, '"'));
                settings.motion_fx_motion_fx_scrolling = "no";
                settings[`motion_fx_${transformType}_effect`] = "no";
                element.setAttribute('data-settings', JSON.stringify(settings).replace(/"/g, '&quot;'));
            }
        } catch (e) {
            console.warn(`Could not modify data-settings for ${transformType}:`, e);
        }
        
        console.log(`${transformType} fixed to 0px for element:`, element);
    }

    // เริ่มต้น
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }

    // เพิ่ม MutationObserver สำหรับทั้งคู่
    function observeStyleChanges() {
        Object.entries(motionElements).forEach(([type, element]) => {
            if (!element) return;

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const currentTransform = element.style.transform;
                        if (currentTransform && currentTransform.includes(type) && 
                            !currentTransform.includes(`${type}(0px)`)) {
                            
                            console.log(`Detected ${type} change, overriding back to 0px`);
                            element.style.setProperty(`--${type}`, '0px', 'important');
                            element.style.setProperty('transform', `${type}(0px)`, 'important');
                        }
                    }
                });
            });

            observer.observe(element, {
                attributes: true,
                attributeFilter: ['style']
            });
        });

        console.log('Combined style change observers activated');
    }

    // เริ่ม observer หลังจาก DOM โหลดเสร็จ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(observeStyleChanges, 200);
        });
    } else {
        setTimeout(observeStyleChanges, 200);
    }

})();
