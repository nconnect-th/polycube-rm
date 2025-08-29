/**
 * Immediate TranslateY Override Script
 * แก้ไขค่า translateY ทันทีเมื่อหน้าเพจโหลด
 */
(function() {
    'use strict';

    // ทำงานทันทีเมื่อ script นี้โหลด
    function immediateTranslateYFix() {
        // ค้นหา element ที่มี translateY
        const targetElement = document.querySelector('[data-id="fe6d408"]');
        
        if (targetElement) {
            console.log('Found target element, applying immediate translateY fix');
            
            // Override ค่า CSS variables และ transform
            targetElement.style.setProperty('--translateY', '0px', 'important');
            targetElement.style.setProperty('transform', 'translateY(0px)', 'important');
            
            // เพิ่ม class เพื่อใช้กับ CSS
            targetElement.classList.add('motion-settled');
            
            // ลบ motion effects ออกจาก data-settings เพื่อป้องกันการ override
            try {
                const currentSettings = targetElement.getAttribute('data-settings');
                if (currentSettings) {
                    const settings = JSON.parse(currentSettings.replace(/&quot;/g, '"'));
                    // ปิดการใช้งาน motion effect
                    settings.motion_fx_motion_fx_scrolling = "no";
                    settings.motion_fx_translateY_effect = "no";
                    targetElement.setAttribute('data-settings', JSON.stringify(settings).replace(/"/g, '&quot;'));
                }
            } catch (e) {
                console.warn('Could not modify data-settings:', e);
            }
            
            console.log('TranslateY fixed to 0px immediately');
            return true;
        }
        return false;
    }

    // ลองทำทันทีหาก element มีอยู่แล้ว
    if (!immediateTranslateYFix()) {
        // หากไม่พบ element ให้ลองอีกครั้งเมื่อ DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', immediateTranslateYFix);
        } else {
            // DOM ready แล้วแต่ยังไม่พบ element ให้รอสักครู่
            setTimeout(immediateTranslateYFix, 100);
        }
    }

    // เพิ่ม MutationObserver เพื่อตรวจจับการเปลี่ยนแปลง style
    function observeStyleChanges() {
        const targetElement = document.querySelector('[data-id="fe6d408"]');
        if (!targetElement) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // หากมีการเปลี่ยนแปลง style ให้ override กลับเป็น 0
                    const currentTransform = targetElement.style.transform;
                    if (currentTransform && currentTransform.includes('translateY') && !currentTransform.includes('translateY(0px)')) {
                        console.log('Detected translateY change, overriding back to 0px');
                        targetElement.style.setProperty('--translateY', '0px', 'important');
                        targetElement.style.setProperty('transform', 'translateY(0px)', 'important');
                    }
                }
            });
        });

        observer.observe(targetElement, {
            attributes: true,
            attributeFilter: ['style']
        });

        console.log('Style change observer activated for translateY element');
    }

    // เริ่ม observer หลังจาก DOM โหลดเสร็จ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeStyleChanges);
    } else {
        setTimeout(observeStyleChanges, 200);
    }

})();
