/**
 * Complete Motion Effects Fix for EDC Page
 * แก้ไขการเคลื่อนไหวของ element ทั้งหมดให้หยุดที่ตำแหน่ง 0
 */
(function() {
    'use strict';

    // Elements ที่ต้องแก้ไข motion effects
    const MOTION_ELEMENTS = [
        {
            id: 'fe6d408',
            type: 'translateY',
            description: 'Main translateY element'
        },
        {
            id: 'b624290', 
            type: 'translateX',
            description: 'Main translateX element'
        },
        {
            id: 'd24770b',
            type: 'translateX',
            description: 'Negative translateX element'
        }
    ];

    function applyMotionFix() {
        console.log('Applying complete motion effects fix for EDC page');

        MOTION_ELEMENTS.forEach(element => {
            const targetElement = document.querySelector(`[data-id="${element.id}"]`);
            
            if (targetElement) {
                console.log(`Found element ${element.id}, applying ${element.type} fix`);
                
                // Apply immediate fix based on motion type
                if (element.type === 'translateY') {
                    targetElement.style.setProperty('--translateY', '0px', 'important');
                    targetElement.style.setProperty('transform', 'translateY(0px)', 'important');
                } else if (element.type === 'translateX') {
                    targetElement.style.setProperty('--translateX', '0px', 'important');
                    targetElement.style.setProperty('transform', 'translateX(0px)', 'important');
                }
                
                // Add class to ensure CSS rules apply
                targetElement.classList.add('motion-settled');
                targetElement.classList.remove('motion-active');
                
                // Disable motion effects in data-settings
                try {
                    const currentSettings = targetElement.getAttribute('data-settings');
                    if (currentSettings) {
                        const settings = JSON.parse(currentSettings.replace(/&quot;/g, '"'));
                        settings.motion_fx_motion_fx_scrolling = "no";
                        if (element.type === 'translateY') {
                            settings.motion_fx_translateY_effect = "no";
                        } else {
                            settings.motion_fx_translateX_effect = "no";
                        }
                        const updatedSettings = JSON.stringify(settings).replace(/"/g, '&quot;');
                        targetElement.setAttribute('data-settings', updatedSettings);
                    }
                } catch (e) {
                    console.warn(`Could not update data-settings for element ${element.id}:`, e);
                }
                
                // Set up observer to prevent overrides
                observeElementChanges(targetElement, element);
            } else {
                console.warn(`Element ${element.id} not found`);
            }
        });
    }

    function observeElementChanges(targetElement, elementConfig) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const currentStyle = targetElement.getAttribute('style') || '';
                    
                    // Check if motion values were changed back
                    if (elementConfig.type === 'translateY' && 
                        (currentStyle.includes('--translateY:') && !currentStyle.includes('--translateY: 0px') ||
                         currentStyle.includes('translateY(') && !currentStyle.includes('translateY(0px)'))) {
                        
                        console.log(`Overriding translateY change for element ${elementConfig.id}`);
                        targetElement.style.setProperty('--translateY', '0px', 'important');
                        targetElement.style.setProperty('transform', 'translateY(0px)', 'important');
                    } else if (elementConfig.type === 'translateX' && 
                              (currentStyle.includes('--translateX:') && !currentStyle.includes('--translateX: 0px') ||
                               currentStyle.includes('translateX(') && !currentStyle.includes('translateX(0px)'))) {
                        
                        console.log(`Overriding translateX change for element ${elementConfig.id}`);
                        targetElement.style.setProperty('--translateX', '0px', 'important');
                        targetElement.style.setProperty('transform', 'translateX(0px)', 'important');
                    }
                }
            });
        });

        observer.observe(targetElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // Apply fixes immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMotionFix);
    } else {
        setTimeout(applyMotionFix, 100);
    }

    // Apply fixes again after a delay to catch late-loading elements
    setTimeout(applyMotionFix, 500);
    setTimeout(applyMotionFix, 1000);
    setTimeout(applyMotionFix, 2000);

    // Listen for scroll events to re-apply fixes if needed
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(applyMotionFix, 100);
    });

})();
