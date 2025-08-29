/**
 * Mobile Menu Handler for Index.html
 * จัดการการเปิด/ปิด mobile menu สำหรับ Elementor structure
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if new Polycube navigation is already initialized
    if (window.polycubeNavInitialized) {
        console.log('New Polycube Navigation detected, skipping legacy mobile menu initialization');
        return;
    }

    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        handleWindowResize();
    });
});

function initMobileMenu() {
    // Get navigation container and menu toggle button
    const navContainer = document.querySelector('.elementor-element-68ee7f6');
    const menuToggle = document.querySelector('.elementor-element-68ee7f6 .elementor-menu-toggle');
    const dropdown = document.querySelector('.elementor-element-68ee7f6 .jet-mega-menu--dropdown');
    
    // Check if elements exist
    if (!navContainer || !menuToggle) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu function
    function toggleMenu() {
        navContainer.classList.toggle('menu-active');
        
        // Update aria attributes for accessibility
        const isActive = navContainer.classList.contains('menu-active');
        menuToggle.setAttribute('aria-expanded', isActive);
        
        if (dropdown) {
            dropdown.setAttribute('aria-hidden', !isActive);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
    
    // Close menu function
    function closeMenu() {
        navContainer.classList.remove('menu-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Menu toggle click event
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on overlay
    navContainer.addEventListener('click', function(e) {
        if (e.target === navContainer && navContainer.classList.contains('menu-active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navContainer.classList.contains('menu-active') && 
            !navContainer.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Handle submenu toggles
    const subMenuParents = document.querySelectorAll('.elementor-element-68ee7f6 .jet-mega-menu--dropdown .menu-item-has-children');
    
    subMenuParents.forEach(function(parent) {
        const link = parent.querySelector('.elementor-item');
        
        if (link) {
            link.addEventListener('click', function(e) {
                // Only handle submenu toggle, don't prevent navigation if it's a link
                if (parent.querySelector('.sub-menu')) {
                    e.preventDefault();
                    parent.classList.toggle('active');
                }
            });
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navContainer.classList.contains('menu-active')) {
            closeMenu();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close menu if window becomes larger than mobile breakpoint
            if (window.innerWidth > 767 && navContainer.classList.contains('menu-active')) {
                closeMenu();
            }
        }, 250);
    });
    
    // Initialize ARIA attributes
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'mobile-menu');
    menuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    
    if (dropdown) {
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('id', 'mobile-menu');
    }
    
    // Add smooth scroll prevention when menu is open
    function preventBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    
    function allowBodyScroll() {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
    
    // Enhanced toggle with smooth animations
    const originalToggle = toggleMenu;
    toggleMenu = function() {
        originalToggle();
        const isActive = navContainer.classList.contains('menu-active');
        
        if (isActive) {
            preventBodyScroll();
            // Add entrance animation class
            if (dropdown) {
                dropdown.style.animation = 'slideDownPrimary 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        } else {
            allowBodyScroll();
        }
    };
    
    // Enhanced close with animation
    const originalClose = closeMenu;
    closeMenu = function() {
        if (dropdown && navContainer.classList.contains('menu-active')) {
            dropdown.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                originalClose();
                dropdown.style.animation = '';
            }, 300);
        } else {
            originalClose();
        }
    };
    
    console.log('Mobile hamburger menu with primary colors initialized successfully');
    console.log('Features: Primary color theme, smooth animations, enhanced UX');
}

function handleWindowResize() {
    const windowWidth = window.innerWidth;
    
    // Close mobile menu if window is resized to desktop
    if (windowWidth > 768) {
        closeMobileMenu();
    }
}

// Initialize menu state on load
function initMenuState() {
    const menuToggle = document.querySelector('.elementor-menu-toggle');
    const dropdownMenu = document.querySelector('.jet-mega-menu--dropdown');
    
    if (!menuToggle || !dropdownMenu) {
        return;
    }
    
    // Ensure menu is closed initially
    dropdownMenu.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Set initial icon state
    const openIcon = menuToggle.querySelector('.elementor-menu-toggle__icon--open');
    const closeIcon = menuToggle.querySelector('.elementor-menu-toggle__icon--close');
    
    if (openIcon && closeIcon) {
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Call init menu state
initMenuState();

/**
 * Enhanced Menu Item Click Handler
 * จัดการการคลิกที่ menu items ใน mobile
 */
function handleMenuItemClick() {
    const menuItems = document.querySelectorAll('.jet-mega-menu-item__link');
    
    menuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            // Check if we're in mobile view
            if (window.innerWidth <= 768) {
                const menu = item.closest('.jet-mega-menu');
                if (menu && menu.classList.contains('jet-mega-menu--mobile-active')) {
                    // Close mobile menu when item is clicked
                    setTimeout(function() {
                        closeMobileMenu(menu);
                    }, 150);
                }
            }
        });
    });
}

// Initialize menu item click handlers
document.addEventListener('DOMContentLoaded', function() {
    handleMenuItemClick();
});

/**
 * Accessibility Enhancements
 */
function enhanceAccessibility() {
    const menuToggles = document.querySelectorAll('.jet-mega-menu-toggle');
    
    menuToggles.forEach(function(toggle) {
        // Set initial aria attributes
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open Menu');
        toggle.setAttribute('role', 'button');
        
        // Handle keyboard navigation
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
    
    // Add role attributes to menu elements
    const menuContainers = document.querySelectorAll('.jet-mega-menu-container');
    menuContainers.forEach(function(container) {
        container.setAttribute('role', 'navigation');
        container.setAttribute('aria-label', 'Main Navigation');
    });
    
    const menuLists = document.querySelectorAll('.jet-mega-menu-list');
    menuLists.forEach(function(list) {
        list.setAttribute('role', 'menubar');
    });
    
    const menuItems = document.querySelectorAll('.jet-mega-menu-item');
    menuItems.forEach(function(item) {
        item.setAttribute('role', 'menuitem');
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
}); 