/**
 * Offline Handler for FAQ Page
 * จัดการการทำงานในโหมด offline และตรวจสอบสถานะการเชื่อมต่อ
 */

class OfflineHandler {
    constructor() {
        this.isOnline = navigator.onLine;
        this.initializeOfflineDetection();
        this.setupImageFallbacks();
        this.replaceBrokenLinks();
    }

    /**
     * ตั้งค่าการตรวจสอบสถานะ online/offline
     */
    initializeOfflineDetection() {
        // สร้าง offline notice element
        const offlineNotice = document.createElement('div');
        offlineNotice.className = 'offline-notice';
        offlineNotice.id = 'offline-notice';
        offlineNotice.innerHTML = '⚠️ คุณกำลังใช้งานในโหมด Offline - บางฟีเจอร์อาจไม่ทำงาน';
        document.body.insertBefore(offlineNotice, document.body.firstChild);

        // ตรวจสอบสถานะเมื่อโหลดหน้าเว็บ
        this.updateOnlineStatus();

        // เพิ่ม event listeners สำหรับการเปลี่ยนแปลงสถานะ
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });
    }

    /**
     * อัพเดทการแสดงผลตามสถานะการเชื่อมต่อ
     */
    updateOnlineStatus() {
        const offlineNotice = document.getElementById('offline-notice');
        if (!this.isOnline) {
            offlineNotice.classList.add('show');
        } else {
            offlineNotice.classList.remove('show');
        }
    }

    /**
     * ตั้งค่า fallback สำหรับรูปภาพที่โหลดไม่ได้
     */
    setupImageFallbacks() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.style.width = img.getAttribute('width') || '100px';
                placeholder.style.height = img.getAttribute('height') || '100px';
                placeholder.textContent = 'ไม่สามารถโหลดรูปภาพ';
                img.parentNode.insertBefore(placeholder, img.nextSibling);
            });
        });
    }

    /**
     * แทนที่ลิงก์ที่เสียให้เป็น placeholder
     */
    replaceBrokenLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        links.forEach(link => {
            if (link.href.includes('nc.co.th') || link.href.includes('google.com/maps')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('ลิงก์นี้ไม่สามารถใช้งานได้ในโหมด offline');
                });
                link.style.color = '#999';
                link.style.textDecoration = 'line-through';
            }
        });
    }

    /**
     * จำลองการทำงานของ Google Maps
     */
    replaceGoogleMaps() {
        const mapContainers = document.querySelectorAll('iframe[src*="google.com/maps"]');
        mapContainers.forEach(iframe => {
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.width = '100%';
            placeholder.style.height = iframe.style.height || '400px';
            placeholder.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>🗺️ แผนที่</h3>
                    <p>แผนที่ Google Maps ไม่สามารถใช้งานได้ในโหมด offline</p>
                    <p><strong>ที่อยู่:</strong> Polycube</p>
                </div>
            `;
            iframe.parentNode.replaceChild(placeholder, iframe);
        });
    }

    /**
     * ล้างข้อมูล localStorage และ sessionStorage หากจำเป็น
     */
    clearStorageIfNeeded() {
        try {
            // ล้างข้อมูลที่อาจจะเก่าหรือไม่จำเป็น
            sessionStorage.removeItem('wpEmojiSettingsSupports');
        } catch (e) {
            console.log('ไม่สามารถล้าง storage:', e);
        }
    }
}

// เริ่มต้นการทำงานเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const offlineHandler = new OfflineHandler();
    
    // แทนที่ Google Maps
    offlineHandler.replaceGoogleMaps();
    
    // ล้างข้อมูลไม่จำเป็น
    offlineHandler.clearStorageIfNeeded();
    
    // เพิ่มสไตล์ fallback ให้กับ body
    document.body.classList.add('fallback-font');
    
    console.log('Offline Handler เริ่มต้นการทำงานแล้ว');
});

// Export สำหรับใช้ในที่อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfflineHandler;
} 