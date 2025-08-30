# FadeIn Animation System - Usage Guide

## Overview
This reusable animation system provides smooth fadeIn animations for website elements using the Intersection Observer API. It supports fadeInLeft, fadeInRight animations and is compatible with Elementor page builder.

## Features
- **Scroll-triggered animations** - Elements animate when they come into view
- **Staggered delays** - Sequential animation effect with 200ms increments
- **Timeline support** - Special handling for timeline components
- **Accordion support** - Automatic animation for accordion elements
- **Elementor compatibility** - Works with elementor-invisible classes
- **Reusable** - Can be used across multiple pages
- **Performance optimized** - Uses Intersection Observer API

## How to Use

### Method 1: Include the JavaScript file
Add this script tag to your HTML head or before closing body tag:
```html
<script src="wp-content/uploads/fadein-animations.js"></script>
```

### Method 2: Add inline code to existing page
Copy the JavaScript code from `fadein-animations.js` and add it to your page's script section.

## CSS Classes

### Basic Animation Classes
- `.fadeInLeftElement` - Animates from left (-100px) to original position
- `.fadeInRightElement` - Animates from right (100px) to original position
- `.elementor-invisible` - Animates from bottom (50px) with fade in

### Timeline Classes (Automatic)
- `.left-part .fadeInLeftElement` - Timeline left items
- `.right-part .fadeInRightElement` - Timeline right items

## HTML Usage Examples

### Basic FadeIn Left
```html
<div class="fadeInLeftElement">
    <h2>This will fade in from the left</h2>
    <p>Content here...</p>
</div>
```

### Basic FadeIn Right
```html
<div class="fadeInRightElement">
    <h2>This will fade in from the right</h2>
    <p>Content here...</p>
</div>
```

### Multiple Elements with Staggered Effect
```html
<div class="fadeInLeftElement">First item (0ms delay)</div>
<div class="fadeInLeftElement">Second item (200ms delay)</div>
<div class="fadeInLeftElement">Third item (400ms delay)</div>
```

### Timeline Usage
For timeline components, the system automatically detects `.left-part` and `.right-part` containers and applies appropriate animations.

### Elementor Integration
Works automatically with Elementor's `.elementor-invisible` class when elements have entrance animations.

## Manual API Usage

If you need to manually control the animations:

```javascript
// Initialize all animations
window.FadeInAnimations.init();

// Initialize only timeline animations
window.FadeInAnimations.initTimeline();

// Initialize only accordion animations
window.FadeInAnimations.initAccordion();

// Add CSS styles manually
window.FadeInAnimations.addCSS();
```

## Configuration Options

### Observer Settings
- **Threshold**: 0.2 (20% of element visible triggers animation)
- **Root Margin**: 50px (triggers 50px before element enters viewport)
- **Stagger Delay**: 200ms between sequential animations

### Timeline Settings
- **Threshold**: 0.3 (30% visible for timeline items)
- **Root Margin**: 100px (earlier trigger for timeline)

### Accordion Settings
- **Threshold**: 0.1 (10% visible for accordion items)
- **Root Margin**: 30px
- **Stagger Delay**: 150ms (faster for accordions)

## Browser Support
- Modern browsers with Intersection Observer API support
- Graceful degradation - elements remain visible if API not supported

## Performance Notes
- Uses efficient Intersection Observer API
- Elements are unobserved after animation to prevent memory leaks
- CSS transitions handle the actual animations for smooth performance
- No jQuery dependency

## Troubleshooting

### Animation not working?
1. Check if the JavaScript file is loaded
2. Verify CSS classes are properly applied
3. Ensure elements are not hidden by parent containers
4. Check browser console for JavaScript errors

### Elements appear immediately?
- CSS styles may not be loaded properly
- Check if `fadein-animation-styles` exists in document head

### Animations too fast/slow?
Modify the transition duration in CSS:
```css
.fadeInLeftElement {
    transition: all 0.8s ease-out; /* Change 0.8s to desired duration */
}
```

## Integration with Existing Code
This system is designed to work alongside existing animations and doesn't interfere with Elementor's built-in animation system.