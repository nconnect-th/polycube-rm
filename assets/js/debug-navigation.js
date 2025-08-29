/* ===== POLYCUBE NAVIGATION DEBUG SCRIPT ===== */

(function() {
    'use strict';

    // Debug function to check navigation visibility
    function debugNavigation() {
        console.log('=== POLYCUBE NAVIGATION DEBUG ===');
        
        // Check for navigation elements
        const polycubeNav = document.querySelector('.polycube-nav');
        const elementorHeaders = document.querySelectorAll('.elementor-location-header, [data-elementor-type="header"], .elementor-element-5c9e955');
        
        console.log('Polycube Navigation:', polycubeNav);
        console.log('Elementor Headers:', elementorHeaders);
        
        // Check mobile menu elements
        const mobileToggle = document.querySelector('.nav-mobile-toggle');
        const mobileMenu = document.querySelector('.nav-mobile-menu');
        const mobileClose = document.querySelector('.nav-mobile-close');
        const mobileLinks = document.querySelectorAll('.nav-mobile-links a');

        console.log('=== MOBILE MENU ELEMENTS ===');
        console.log('Mobile Toggle:', mobileToggle);
        console.log('Mobile Menu:', mobileMenu);
        console.log('Mobile Close:', mobileClose);
        console.log('Mobile Links:', mobileLinks.length);
        
        if (polycubeNav) {
            const computedStyle = window.getComputedStyle(polycubeNav);
            console.log('Polycube Nav Styles:', {
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                position: computedStyle.position,
                zIndex: computedStyle.zIndex
            });
        }

        if (mobileToggle) {
            const toggleStyle = window.getComputedStyle(mobileToggle);
            console.log('Mobile Toggle Styles:', {
                display: toggleStyle.display,
                visibility: toggleStyle.visibility,
                opacity: toggleStyle.opacity
            });
        }

        if (mobileMenu) {
            const menuStyle = window.getComputedStyle(mobileMenu);
            console.log('Mobile Menu Styles:', {
                display: menuStyle.display,
                visibility: menuStyle.visibility,
                opacity: menuStyle.opacity,
                transform: menuStyle.transform
            });
        }
        
        elementorHeaders.forEach((header, index) => {
            const headerStyle = window.getComputedStyle(header);
            console.log(`Elementor Header ${index} Styles:`, {
                display: headerStyle.display,
                visibility: headerStyle.visibility,
                opacity: headerStyle.opacity
            });
        });

        // Check screen size
        console.log('Screen width:', window.innerWidth);
        console.log('Is mobile?:', window.innerWidth <= 768);
    }

    // Force fix function
    function forceFixNavigation() {
        console.log('🔧 Force fixing navigation...');
        
        // Hide Elementor headers
        const elementorHeaders = document.querySelectorAll(
            '.elementor-location-header, [data-elementor-type="header"], .elementor-element-5c9e955'
        );
        
        elementorHeaders.forEach(header => {
            header.style.display = 'none !important';
            header.style.visibility = 'hidden !important';
            header.style.opacity = '0 !important';
        });

        // Show Polycube navigation
        const polycubeNav = document.querySelector('.polycube-nav');
        if (polycubeNav) {
            polycubeNav.style.display = 'block !important';
            polycubeNav.style.visibility = 'visible !important';
            polycubeNav.style.opacity = '1 !important';
            polycubeNav.style.position = 'sticky !important';
            polycubeNav.style.top = '0 !important';
            polycubeNav.style.zIndex = '99999 !important';
        }

        // Fix mobile menu visibility
        const mobileToggle = document.querySelector('.nav-mobile-toggle');
        const mobileMenu = document.querySelector('.nav-mobile-menu');

        if (window.innerWidth <= 768) {
            if (mobileToggle) {
                mobileToggle.style.display = 'flex !important';
                mobileToggle.style.visibility = 'visible !important';
                mobileToggle.style.opacity = '1 !important';
            }
            
            if (mobileMenu) {
                mobileMenu.style.display = 'flex !important';
            }

            // Hide desktop menu
            const desktopMenu = document.querySelector('.nav-menu');
            const desktopActions = document.querySelector('.nav-actions');
            
            if (desktopMenu) {
                desktopMenu.style.display = 'none !important';
            }
            if (desktopActions) {
                desktopActions.style.display = 'none !important';
            }
        }

        console.log('✅ Navigation force fix applied');
    }

    // Test mobile menu functionality
    function testMobileMenu() {
        console.log('🧪 Testing mobile menu functionality...');
        
        const mobileToggle = document.querySelector('.nav-mobile-toggle');
        const mobileMenu = document.querySelector('.nav-mobile-menu');
        
        if (mobileToggle && mobileMenu) {
            // Simulate click
            console.log('Simulating mobile toggle click...');
            mobileToggle.click();
            
            setTimeout(() => {
                const isActive = mobileMenu.classList.contains('active');
                console.log('Mobile menu active after click:', isActive);
                
                // Close menu
                setTimeout(() => {
                    mobileToggle.click();
                    const isStillActive = mobileMenu.classList.contains('active');
                    console.log('Mobile menu still active after second click:', isStillActive);
                }, 1000);
            }, 500);
        } else {
            console.warn('Mobile menu elements not found for testing');
        }
    }

    // Initialize debug on DOM ready
    function initDebug() {
        debugNavigation();
        
        // Add debug buttons to page
        const debugPanel = document.createElement('div');
        debugPanel.id = 'nav-debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 999999;
            font-family: monospace;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 200px;
        `;

        debugPanel.innerHTML = `
            <div style="font-weight: bold; text-align: center;">Nav Debug</div>
            <button onclick="window.debugNav()" style="padding: 5px; cursor: pointer;">Debug Nav</button>
            <button onclick="window.forceFixNav()" style="padding: 5px; cursor: pointer;">Force Fix</button>
            <button onclick="window.testMobileMenu()" style="padding: 5px; cursor: pointer;">Test Mobile</button>
            <button onclick="document.getElementById('nav-debug-panel').remove()" style="padding: 5px; cursor: pointer;">Close</button>
        `;

        document.body.appendChild(debugPanel);

        // Make functions globally available
        window.debugNav = debugNavigation;
        window.forceFixNav = forceFixNavigation;
        window.testMobileMenu = testMobileMenu;

        console.log('🔍 Navigation debug panel added to page');
    }

    // Auto-fix on mobile
    function autoFixMobile() {
        if (window.innerWidth <= 768) {
            console.log('📱 Mobile detected, applying auto-fix...');
            setTimeout(forceFixNavigation, 1000);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initDebug, 2000);
            setTimeout(autoFixMobile, 3000);
        });
    } else {
        setTimeout(initDebug, 2000);
        setTimeout(autoFixMobile, 3000);
    }

})(); 