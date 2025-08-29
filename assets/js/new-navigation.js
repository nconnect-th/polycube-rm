/* ===== NEW POLYCUBE NAVIGATION JAVASCRIPT ===== */

(function() {
    'use strict';

    // Disable other navigation scripts to prevent conflicts
    window.polycubeNavInitialized = true;

    // DOM Elements
    let mobileToggle = null;
    let navMenu = null;
    let navActions = null;
    let nav = null;

    // NEW: Mobile menu elements
    let mobileMenu = null;
    let mobileClose = null;
    let mobileLinks = null;

    // State
    let isMenuOpen = false;
    let scrollTimeout = null;

    // Initialize Navigation
    function initNavigation() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupNavigation);
        } else {
            setupNavigation();
        }
    }

    // Setup Navigation Elements and Event Listeners
    function setupNavigation() {
        // Disable Elementor navigation first
        disableElementorNavigation();

        // Get navigation elements - both old and new structure
        nav = document.querySelector('.polycube-nav');
        
        // Old structure (for compatibility)
        mobileToggle = document.querySelector('.mobile-toggle');
        navMenu = document.querySelector('.nav-menu');
        navActions = document.querySelector('.nav-actions');

        // NEW structure 
        const newMobileToggle = document.querySelector('.nav-mobile-toggle');
        mobileMenu = document.querySelector('.nav-mobile-menu');
        mobileClose = document.querySelector('.nav-mobile-close');
        mobileLinks = document.querySelectorAll('.nav-mobile-links a');

        // Use new mobile toggle if available, fallback to old
        if (newMobileToggle) {
            mobileToggle = newMobileToggle;
        }

        // Force show navigation
        forceShowNavigation();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup scroll listener
        setupScrollEffects();
        
        // Setup active menu item
        setActiveMenuItem();
        
        // Setup smooth scrolling
        setupSmoothScrolling();

        console.log('🚀 Polycube Navigation initialized successfully');
        console.log('Navigation elements found:', { 
            nav, 
            mobileToggle, 
            mobileMenu,
            mobileClose,
            mobileLinksCount: mobileLinks ? mobileLinks.length : 0,
            navMenu, 
            navActions 
        });
    }

    // Disable Elementor Navigation
    function disableElementorNavigation() {
        // Hide all Elementor navigation elements
        const elementorHeaders = document.querySelectorAll(
            '.elementor-location-header, [data-elementor-type="header"], .elementor-element-5c9e955, .elementor-sticky'
        );
        
        elementorHeaders.forEach(element => {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.position = 'absolute';
            element.style.top = '-9999px';
            element.style.left = '-9999px';
            element.style.zIndex = '-9999';
        });

        // Disable Elementor menu toggles
        const elementorToggles = document.querySelectorAll('.elementor-menu-toggle');
        elementorToggles.forEach(toggle => {
            toggle.removeEventListener('click', () => {});
            toggle.style.pointerEvents = 'none';
        });
    }

    // Force Show Navigation
    function forceShowNavigation() {
        if (nav) {
            nav.style.display = 'block';
            nav.style.visibility = 'visible';
            nav.style.opacity = '1';
            nav.style.position = 'sticky';
            nav.style.top = '0';
            nav.style.zIndex = '99999';
            nav.style.width = '100%';
            nav.style.background = 'white';
        }

        // Show navigation elements
        [navMenu, navActions, mobileToggle].forEach(element => {
            if (element) {
                element.style.display = 'flex';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            }
        });

        // Show logo
        const logo = document.querySelector('.polycube-nav .nav-logo img');
        if (logo) {
            logo.style.display = 'block';
            logo.style.visibility = 'visible';
            logo.style.opacity = '1';
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', toggleMobileMenu);
        }

        // NEW: Mobile menu close button
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }

        // Close menu when clicking on nav links (both old and new structure)
        const allNavLinks = [
            ...document.querySelectorAll('.polycube-nav .nav-link'),
            ...document.querySelectorAll('.nav-mobile-links a')
        ];
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && nav && !nav.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', handleResize);

        // Prevent scroll when menu is open
        document.addEventListener('touchmove', (e) => {
            if (isMenuOpen) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Toggle Mobile Menu
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open Mobile Menu
    function openMobileMenu() {
        isMenuOpen = true;
        
        // Update toggle button state and icon
        if (mobileToggle) {
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
            
            // Change icon to close (X)
            const toggleIcon = mobileToggle.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.className = 'fas fa-times toggle-icon';
            }
        }

        // Show mobile menu (new structure)
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
        }
        
        // Show old structure menu
        if (navMenu) {
            navMenu.classList.add('active');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        // Animate menu items (new structure)
        if (mobileLinks && mobileLinks.length > 0) {
            mobileLinks.forEach((link, index) => {
                link.style.animation = `slideInLeft 0.5s ease ${index * 0.1}s forwards`;
            });
        }

        // Animate old structure menu items
        const oldNavLinks = document.querySelectorAll('.nav-link');
        oldNavLinks.forEach((link, index) => {
            link.style.animation = `slideInLeft 0.5s ease ${index * 0.1}s forwards`;
        });

        // Show nav actions after menu animation
        setTimeout(() => {
            if (navActions) {
                navActions.style.opacity = '1';
                navActions.style.visibility = 'visible';
            }
        }, 300);

        console.log('📱 Mobile menu opened');
    }

    // Close Mobile Menu
    function closeMobileMenu() {
        isMenuOpen = false;
        
        // Update toggle button state and icon
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            
            // Change icon back to hamburger
            const toggleIcon = mobileToggle.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.className = 'fas fa-bars toggle-icon';
            }
        }

        // Hide mobile menu (new structure)
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
        
        // Hide old structure menu
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';

        // Hide nav actions
        if (navActions) {
            navActions.style.opacity = '0';
            navActions.style.visibility = 'hidden';
        }

        // Reset animations (new structure)
        if (mobileLinks && mobileLinks.length > 0) {
            mobileLinks.forEach(link => {
                link.style.animation = '';
            });
        }

        // Reset animations (old structure)
        const oldNavLinks = document.querySelectorAll('.nav-link');
        oldNavLinks.forEach(link => {
            link.style.animation = '';
        });

        console.log('📱 Mobile menu closed');
    }

    // Handle Window Resize
    function handleResize() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
    }

    // Setup Scroll Effects
    function setupScrollEffects() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Add scrolled class for backdrop effect
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set new timeout for scroll end
            scrollTimeout = setTimeout(() => {
                // Scroll ended
            }, 150);

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Set Active Menu Item
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove existing active class
            link.classList.remove('active');

            // Check for exact match or hash match
            if (href === currentPath || 
                href === currentPath + currentHash ||
                (href.includes('#') && href === window.location.pathname + window.location.hash)) {
                link.classList.add('active');
            }

            // Special case for home page
            if ((currentPath === '/' || currentPath === '/index.html') && 
                (href === 'index.html' || href === '/')) {
                link.classList.add('active');
            }
        });

        // Set active language
        const langLinks = document.querySelectorAll('.lang-link');
        langLinks.forEach(link => {
            link.classList.remove('active');
            if (currentPath.includes('/en/')) {
                if (link.textContent.trim() === 'EN') {
                    link.classList.add('active');
                }
            } else {
                if (link.textContent.trim() === 'TH') {
                    link.classList.add('active');
                }
            }
        });
    }

    // Setup Smooth Scrolling
    function setupSmoothScrolling() {
        const anchorsLinks = document.querySelectorAll('a[href*="#"]');
        
        anchorsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Check if it's an anchor link on the same page
                if (href.startsWith('#') || href.includes(window.location.pathname + '#')) {
                    const targetId = href.split('#')[1];
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Close mobile menu if open
                        if (isMenuOpen) {
                            closeMobileMenu();
                        }
                        
                        // Smooth scroll to target
                        const offsetTop = targetElement.offsetTop - (nav.offsetHeight + 20);
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });

                        // Update URL hash
                        history.pushState(null, null, '#' + targetId);
                        
                        // Update active menu item
                        setTimeout(() => {
                            setActiveMenuItem();
                        }, 100);
                    }
                }
            });
        });
    }

    // Public API
    window.PolycubeNav = {
        init: initNavigation,
        openMenu: openMobileMenu,
        closeMenu: closeMobileMenu,
        toggleMenu: toggleMobileMenu,
        setActive: setActiveMenuItem
    };

    // Auto-initialize
    initNavigation();

})();

// ===== Additional Utilities =====

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Performance monitoring (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Polycube Navigation - Development Mode');
    
    // Log performance metrics
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`⚡ Navigation loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        }, 1000);
    });
} 