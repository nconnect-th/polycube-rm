/**
 * Chrome Extension Detector
 * ตรวจสอบและแสดงข้อมูล Chrome Extensions ที่อาจจะ inject เข้ามาในหน้าเว็บ
 */

class ChromeExtensionDetector {
    constructor() {
        this.detectedExtensions = [];
        this.mutationObserver = null;
        this.init();
    }

    init() {
        // ตรวจสอบทันทีหลังโหลดหน้าเว็บ
        this.detectInjectedContent();
        
        // ตั้ง MutationObserver เพื่อติดตามการเปลี่ยนแปลง DOM
        this.setupMutationObserver();
        
        // แสดงผลลัพธ์
        this.displayResults();
    }

    detectInjectedContent() {
        console.log('🔍 กำลังตรวจสอบ Chrome Extensions...');
        
        // 1. ตรวจสอบ chrome-extension:// URLs
        this.detectChromeExtensionURLs();
        
        // 2. ตรวจสอบ elements ที่มี ID หรือ class ที่ไม่ใช่ของเว็บ
        this.detectSuspiciousElements();
        
        // 3. ตรวจสอบ CSS ที่ถูก inject
        this.detectInjectedCSS();
        
        // 4. ตรวจสอบ Scripts ที่ถูก inject
        this.detectInjectedScripts();
        
        // 5. ตรวจสอบ Known Extension Patterns
        this.detectKnownExtensionPatterns();
    }

    detectChromeExtensionURLs() {
        // ตรวจสอบใน stylesheet links
        const links = document.querySelectorAll('link[href*="chrome-extension://"]');
        links.forEach(link => {
            const extensionId = this.extractExtensionId(link.href);
            this.addDetectedExtension(extensionId, 'CSS Link', link.href);
        });

        // ตรวจสอบใน script sources
        const scripts = document.querySelectorAll('script[src*="chrome-extension://"]');
        scripts.forEach(script => {
            const extensionId = this.extractExtensionId(script.src);
            this.addDetectedExtension(extensionId, 'Script', script.src);
        });

        // ตรวจสอบใน images
        const images = document.querySelectorAll('img[src*="chrome-extension://"]');
        images.forEach(img => {
            const extensionId = this.extractExtensionId(img.src);
            this.addDetectedExtension(extensionId, 'Image', img.src);
        });
    }

    detectSuspiciousElements() {
        // Known extension element patterns
        const suspiciousSelectors = [
            '[id*="floik"]',
            '[id*="extension"]',
            '[class*="floik"]',
            '[class*="extension"]',
            'grammarly-desktop-integration',
            'utilengine-app',
            '[id*="super"]',
            '[id*="dev"]',
            '[data-grammarly-shadow-root]'
        ];

        suspiciousSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const info = {
                    tagName: element.tagName,
                    id: element.id,
                    className: element.className,
                    innerHTML: element.innerHTML.substring(0, 100) + '...'
                };
                this.addDetectedExtension('Unknown', 'DOM Element', JSON.stringify(info));
            });
        });
    }

    detectInjectedCSS() {
        // ตรวจสอบ style tags ที่ไม่ได้อยู่ใน source code เดิม
        const styleTags = document.querySelectorAll('style');
        styleTags.forEach(style => {
            const content = style.textContent || style.innerHTML;
            
            // ตรวจสอบ known extension CSS patterns
            if (content.includes('floik') || 
                content.includes('extension') || 
                content.includes('grammarly') ||
                content.includes('utilengine')) {
                
                this.addDetectedExtension(
                    'Unknown', 
                    'Injected CSS', 
                    content.substring(0, 200) + '...'
                );
            }
        });
    }

    detectInjectedScripts() {
        // ตรวจสอบ script tags ที่อาจจะถูก inject
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            const content = script.textContent || script.innerHTML;
            
            // ตรวจสอบ patterns ที่อาจจะเป็นของ extension
            if (content.includes('chrome.runtime') || 
                content.includes('browser.runtime') ||
                content.includes('extension') ||
                content.includes('content_script')) {
                
                this.addDetectedExtension(
                    'Unknown', 
                    'Injected Script', 
                    content.substring(0, 200) + '...'
                );
            }
        });
    }

    detectKnownExtensionPatterns() {
        // รายการ extension patterns ที่รู้จัก
        const knownPatterns = {
            'floik': 'Floik Extension (Screen Recording/Annotation)',
            'grammarly': 'Grammarly Writing Assistant',
            'utilengine': 'UtilEngine Extension',
            'adblock': 'AdBlock Extension',
            'lastpass': 'LastPass Password Manager',
            'metamask': 'MetaMask Wallet',
            'honey': 'Honey Coupon Extension'
        };

        Object.keys(knownPatterns).forEach(pattern => {
            const found = document.querySelector(`[id*="${pattern}"], [class*="${pattern}"]`);
            if (found) {
                this.addDetectedExtension(
                    pattern, 
                    'Known Extension', 
                    knownPatterns[pattern]
                );
            }
        });
    }

    setupMutationObserver() {
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // ตรวจสอบ node ใหม่ที่ถูกเพิ่มเข้ามา
                        this.checkNewNode(node);
                    }
                });
            });
        });

        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id', 'class']
        });
    }

    checkNewNode(node) {
        // ตรวจสอบ node ใหม่ว่ามาจาก extension หรือไม่
        const suspiciousPatterns = ['floik', 'extension', 'grammarly', 'utilengine'];
        
        suspiciousPatterns.forEach(pattern => {
            if (node.id && node.id.includes(pattern) ||
                node.className && node.className.includes(pattern)) {
                
                console.log('🚨 ตรวจพบ Extension Element ใหม่:', {
                    tagName: node.tagName,
                    id: node.id,
                    className: node.className
                });
                
                this.addDetectedExtension(
                    pattern,
                    'Dynamically Added',
                    `${node.tagName} - ${node.id || node.className}`
                );
            }
        });
    }

    extractExtensionId(url) {
        const match = url.match(/chrome-extension:\/\/([a-z]{32})\//);
        return match ? match[1] : 'unknown';
    }

    addDetectedExtension(id, type, details) {
        const existing = this.detectedExtensions.find(ext => 
            ext.id === id && ext.type === type && ext.details === details
        );
        
        if (!existing) {
            this.detectedExtensions.push({
                id,
                type,
                details,
                timestamp: new Date().toISOString()
            });
        }
    }

    displayResults() {
        setTimeout(() => {
            console.group('📊 ผลการตรวจสอบ Chrome Extensions');
            
            if (this.detectedExtensions.length === 0) {
                console.log('✅ ไม่พบ Chrome Extensions ที่ inject เข้ามาในหน้าเว็บ');
            } else {
                console.log(`🔍 พบ Chrome Extensions ${this.detectedExtensions.length} รายการ:`);
                
                this.detectedExtensions.forEach((ext, index) => {
                    console.group(`${index + 1}. ${ext.type} - ${ext.id}`);
                    console.log('รายละเอียด:', ext.details);
                    console.log('เวลา:', ext.timestamp);
                    console.groupEnd();
                });
            }
            
            console.groupEnd();
            
            // สร้าง report object เพื่อให้เข้าถึงได้จาก console
            window.extensionDetectorReport = {
                totalFound: this.detectedExtensions.length,
                extensions: this.detectedExtensions,
                getReport: () => this.detectedExtensions,
                getKnownExtensions: () => this.detectedExtensions.filter(ext => ext.type === 'Known Extension')
            };
            
            console.log('💡 สำหรับดูรายงานแบบละเอียด ใช้คำสั่ง: window.extensionDetectorReport.getReport()');
            
        }, 2000); // รอ 2 วินาที เพื่อให้ DOM โหลดเสร็จ
    }

    destroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }
}

// เริ่มการตรวจสอบเมื่อ DOM พร้อม
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chromeExtensionDetector = new ChromeExtensionDetector();
    });
} else {
    window.chromeExtensionDetector = new ChromeExtensionDetector();
}
