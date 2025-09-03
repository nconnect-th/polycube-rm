/**
 * Social Media Sharing Functions
 * Reusable functions for Facebook, Twitter, and LinkedIn sharing
 */

// Social Sharing Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, 'facebook-share', 'width=580,height=400,scrollbars=yes,resizable=yes');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    window.open(twitterUrl, 'twitter-share', 'width=580,height=400,scrollbars=yes,resizable=yes');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedinUrl, 'linkedin-share', 'width=580,height=400,scrollbars=yes,resizable=yes');
}

// Initialize share buttons with keyboard accessibility
function initializeSocialSharing() {
    document.addEventListener('DOMContentLoaded', function() {
        const shareButtons = document.querySelectorAll('.elementor-share-btn');
        shareButtons.forEach(button => {
            button.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    });
}

// Auto-initialize when script is loaded
initializeSocialSharing();

// For ES6 modules compatibility (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        shareOnFacebook,
        shareOnTwitter,
        shareOnLinkedIn,
        initializeSocialSharing
    };
}

// For global window object
if (typeof window !== 'undefined') {
    window.SocialSharing = {
        shareOnFacebook,
        shareOnTwitter,
        shareOnLinkedIn,
        initializeSocialSharing
    };
}
