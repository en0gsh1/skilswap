// Original Coupon system (preserved)
const originalCoupons = {
    'SKILLSWAP10': { discount: 10, type: 'percentage', description: '10% off first booking' },
    'WELCOME15': { discount: 15, type: 'percentage', description: '15% off any purchase' },
    'LEARN20': { discount: 20, type: 'fixed', description: '€20 off orders over €100', minAmount: 100 },
    'FIRST25': { discount: 25, type: 'percentage', description: '25% off first two sessions' },
    'SUMMER5': { discount: 5, type: 'fixed', description: '€5 off any session' },
    'REFER10': { discount: 10, type: 'percentage', description: '10% off when you refer a friend' },
    'BUNDLE30': { discount: 30, type: 'percentage', description: '30% off bundled courses' },
    'FLASH15': { discount: 15, type: 'percentage', description: '15% off for 48 hours only' },
    'STUDENT20': { discount: 20, type: 'percentage', description: '20% off with valid student email' },
    'LOYALTY10': { discount: 10, type: 'percentage', description: '10% off your 5th booking' },
    'AULON10': { discount: 10, type: 'percentage', description: '10% off any booking' },
    'FATLUME15': { discount: 15, type: 'percentage', description: '15% off sessions over €75', minAmount: 75 },
    'ENO20': { discount: 20, type: 'fixed', description: '€20 off orders over €120', minAmount: 120 },
    'LIS10': { discount: 10, type: 'percentage', description: '10% off first session' },
    'TUANA25': { discount: 25, type: 'percentage', description: '25% off bundle of 3+ sessions' },
    'AURORA15': { discount: 15, type: 'percentage', description: '15% off during "Early Bird" period' },
    'KLEST30': { discount: 30, type: 'percentage', description: '30% off advanced courses bundle' }
};

// Enhanced Coupon system with additional features
const coupons = {
    // Original coupons with enhanced features
    'SKILLSWAP10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off first booking',
        category: 'welcome',
        expiryDays: 30,
        firstTimeOnly: true
    },
    'WELCOME15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off any purchase',
        category: 'welcome',
        expiryDays: 14
    },
    'LEARN20': { 
        discount: 20, 
        type: 'fixed', 
        description: '€20 off orders over €100', 
        minAmount: 100,
        category: 'volume',
        currency: 'EUR'
    },
    'FIRST25': { 
        discount: 25, 
        type: 'percentage', 
        description: '25% off first two sessions',
        category: 'welcome',
        maxUsage: 2,
        firstTimeOnly: true
    },
    'SUMMER5': { 
        discount: 5, 
        type: 'fixed', 
        description: '€5 off any session',
        category: 'seasonal',
        currency: 'EUR',
        expiryDays: 90
    },
    'REFER10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off when you refer a friend',
        category: 'referral',
        requiresReferral: true
    },
    'BUNDLE30': { 
        discount: 30, 
        type: 'percentage', 
        description: '30% off bundled courses',
        category: 'bundle',
        minCourses: 2
    },
    'FLASH15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off for 48 hours only',
        category: 'flash',
        expiryHours: 48
    },
    'STUDENT20': { 
        discount: 20, 
        type: 'percentage', 
        description: '20% off with valid student email',
        category: 'student',
        requiresVerification: true,
        emailDomains: ['edu', 'ac.uk', 'student']
    },
    'LOYALTY10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off your 5th booking',
        category: 'loyalty',
        minBookings: 5
    },
    'AULON10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off any booking',
        category: 'general',
        expiryDays: 60
    },
    'FATLUME15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off sessions over €75', 
        minAmount: 75,
        category: 'volume',
        currency: 'EUR'
    },
    'ENO20': { 
        discount: 20, 
        type: 'fixed', 
        description: '€20 off orders over €120', 
        minAmount: 120,
        category: 'volume',
        currency: 'EUR'
    },
    'LIS10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off first session',
        category: 'welcome',
        firstTimeOnly: true,
        expiryDays: 21
    },
    'TUANA25': { 
        discount: 25, 
        type: 'percentage', 
        description: '25% off bundle of 3+ sessions',
        category: 'bundle',
        minCourses: 3
    },
    'AURORA15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off during "Early Bird" period',
        category: 'time-limited',
        timeRestriction: 'early-bird'
    },
    'KLEST30': { 
        discount: 30, 
        type: 'percentage', 
        description: '30% off advanced courses bundle',
        category: 'bundle',
        courseLevel: 'advanced',
        minCourses: 2
    },
        'ERLETA5': { 
        discount: 5, 
        type: 'percentage', 
        description: '5% off advanced courses bundle',
        category: 'time-limited',
        courseLevel: 'early-bird'
    },
        'JELIRA15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off advanced courses bundle',
        category: 'time-limited',
        courseLevel: 'early-bird'
    },

    // Additional enhanced coupons
    'WEEKEND10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off weekend bookings',
        category: 'time-limited',
        weekendOnly: true
    },
    'NEWBIE20': { 
        discount: 20, 
        type: 'percentage', 
        description: '20% off for new users',
        category: 'welcome',
        newUserOnly: true,
        expiryDays: 7
    },
    'COMEBACK15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off - Welcome back!',
        category: 'loyalty',
        returningUserOnly: true
    },
    'EARLYBIRD25': { 
        discount: 25, 
        type: 'percentage', 
        description: '25% off early morning sessions',
        category: 'time-limited',
        timeSlot: 'morning'
    },
    'MEGA50': { 
        discount: 50, 
        type: 'fixed', 
        description: '€50 off orders over €300',
        category: 'volume',
        minAmount: 300,
        currency: 'EUR'
    },
    'TEACHER15': { 
        discount: 15, 
        type: 'percentage', 
        description: '15% off for educators',
        category: 'educator',
        requiresVerification: true
    },
    'GROUPSAVE20': { 
        discount: 20, 
        type: 'percentage', 
        description: '20% off group bookings (4+ people)',
        category: 'group',
        minParticipants: 4
    },
    'LASTMINUTE10': { 
        discount: 10, 
        type: 'percentage', 
        description: '10% off last-minute bookings',
        category: 'time-limited',
        lastMinute: true
    }
};

class CouponManager {
    constructor() {
        this.originalPrice = 100;
        this.currentPrice = 100;
        this.appliedCoupon = null;
        this.userProfile = this.loadUserProfile();
        this.cartItems = [];
        this.bookingHistory = [];
        this.init();
    }

    init() {
        const applyBtn = document.getElementById('apply-coupon');
        const couponInput = document.getElementById('coupon-input');
        
        if (applyBtn && couponInput) {
            applyBtn.addEventListener('click', () => this.applyCoupon());
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyCoupon();
                }
            });
        }

        // Load available coupons
        this.loadAvailableCoupons();
        this.loadBookingHistory();
    }

    loadUserProfile() {
        return {
            isStudent: localStorage.getItem('isStudent') === 'true',
            isTeacher: localStorage.getItem('isTeacher') === 'true',
            isNewUser: localStorage.getItem('hasBooked') !== 'true',
            bookingCount: parseInt(localStorage.getItem('bookingCount')) || 0,
            email: localStorage.getItem('userEmail') || '',
            lastBookingDate: localStorage.getItem('lastBookingDate'),
            referralCode: localStorage.getItem('referralCode')
        };
    }

    loadBookingHistory() {
        const history = localStorage.getItem('skillswap_booking_history');
        this.bookingHistory = history ? JSON.parse(history) : [];
    }

    loadAvailableCoupons() {
        const availableCoupons = this.getAvailableCoupons();
        this.displayAvailableCoupons(availableCoupons);
    }

    getAvailableCoupons() {
        const available = [];
        const now = new Date();

        for (const [code, coupon] of Object.entries(coupons)) {
            if (this.isCouponValidForUser(code, coupon)) {
                available.push({ code, ...coupon });
            }
        }

        return available.sort((a, b) => b.discount - a.discount);
    }

    isCouponValidForUser(code, coupon) {
        // Check if already used and has usage limits
        if (this.hasCouponBeenUsed(code)) {
            const usageCount = this.getCouponUsageCount(code);
            if (coupon.maxUsage && usageCount >= coupon.maxUsage) {
                return false;
            }
        }

        // Check first-time user restrictions
        if (coupon.firstTimeOnly && !this.userProfile.isNewUser) {
            return false;
        }

        if (coupon.newUserOnly && !this.userProfile.isNewUser) {
            return false;
        }

        // Check returning user restrictions
        if (coupon.returningUserOnly && this.userProfile.isNewUser) {
            return false;
        }

        // Check booking count requirements
        if (coupon.minBookings && this.userProfile.bookingCount < coupon.minBookings) {
            return false;
        }

        // Check student verification
        if (coupon.requiresVerification && coupon.category === 'student') {
            if (!this.userProfile.isStudent || !this.isValidStudentEmail(this.userProfile.email)) {
                return false;
            }
        }

        // Check teacher verification
        if (coupon.requiresVerification && coupon.category === 'educator') {
            if (!this.userProfile.isTeacher) {
                return false;
            }
        }

        // Check referral requirements
        if (coupon.requiresReferral && !this.userProfile.referralCode) {
            return false;
        }

        // Check time-based restrictions
        if (coupon.weekendOnly && !this.isWeekend()) {
            return false;
        }

        // Check expiry
        if (coupon.expiryHours) {
            // In real app, you'd check against coupon creation time
            // For now, assume all flash coupons are valid
        }

        return true;
    }

    isValidStudentEmail(email) {
        if (!email) return false;
        const studentDomains = ['edu', 'ac.uk', 'student', 'university'];
        return studentDomains.some(domain => email.toLowerCase().includes(domain));
    }

    isWeekend() {
        const day = new Date().getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    }

    applyCoupon() {
        const couponInput = document.getElementById('coupon-input');
        const couponCode = couponInput.value.trim().toUpperCase();

        if (!couponCode) {
            this.showMessage('Please enter a coupon code', 'error');
            return;
        }

        const coupon = coupons[couponCode];
        
        if (!coupon) {
            this.showMessage('Invalid coupon code', 'error');
            return;
        }

        // Validate coupon for current user
        if (!this.isCouponValidForUser(couponCode, coupon)) {
            this.showMessage('This coupon is not valid for your account or has expired', 'error');
            return;
        }

        // Check minimum amount requirement
        if (coupon.minAmount && this.originalPrice < coupon.minAmount) {
            const currency = coupon.currency || '$';
            this.showMessage(`This coupon requires a minimum order of ${currency}${coupon.minAmount}`, 'error');
            return;
        }

        // Check minimum courses requirement
        if (coupon.minCourses && this.cartItems.length < coupon.minCourses) {
            this.showMessage(`This coupon requires at least ${coupon.minCourses} courses in your cart`, 'error');
            return;
        }

        // Check course level requirement
        if (coupon.courseLevel && !this.hasRequiredCourseLevel(coupon.courseLevel)) {
            this.showMessage(`This coupon is only valid for ${coupon.courseLevel} level courses`, 'error');
            return;
        }

        // Apply the coupon
        this.appliedCoupon = { code: couponCode, ...coupon };
        this.calculateDiscount();
        this.updateDisplay();
        this.showMessage(`Coupon applied successfully! ${coupon.description}`, 'success');
        
        // Save coupon usage
        this.saveCouponUsage(couponCode, coupon);
        
        // Clear input and disable button
        couponInput.value = '';
        const applyBtn = document.getElementById('apply-coupon');
        if (applyBtn) {
            applyBtn.textContent = 'Applied';
            applyBtn.disabled = true;
        }
    }

    hasRequiredCourseLevel(requiredLevel) {
        // Check if cart has courses of required level
        return this.cartItems.some(item => item.level === requiredLevel);
    }

    hasCouponBeenUsed(couponCode) {
        const usedCoupons = JSON.parse(localStorage.getItem('skillswap_used_coupons') || '[]');
        return usedCoupons.some(used => used.code === couponCode);
    }

    getCouponUsageCount(couponCode) {
        const usedCoupons = JSON.parse(localStorage.getItem('skillswap_used_coupons') || '[]');
        return usedCoupons.filter(used => used.code === couponCode).length;
    }

    saveCouponUsage(couponCode, coupon) {
        const usedCoupons = JSON.parse(localStorage.getItem('skillswap_used_coupons') || '[]');
        const discountAmount = this.calculateDiscount();
        
        usedCoupons.push({
            code: couponCode,
            description: coupon.description,
            discount: coupon.discount,
            type: coupon.type,
            savings: discountAmount,
            usedDate: new Date().toISOString(),
            originalAmount: this.originalPrice,
            finalAmount: this.currentPrice,
            currency: coupon.currency || 'USD'
        });
        
        localStorage.setItem('skillswap_used_coupons', JSON.stringify(usedCoupons));
    }

    calculateDiscount() {
        if (!this.appliedCoupon) return 0;

        let discountAmount = 0;
        
        if (this.appliedCoupon.type === 'percentage') {
            discountAmount = (this.originalPrice * this.appliedCoupon.discount) / 100;
        } else if (this.appliedCoupon.type === 'fixed') {
            discountAmount = this.appliedCoupon.discount;
        }

        // Ensure discount doesn't exceed original price
        discountAmount = Math.min(discountAmount, this.originalPrice);
        this.currentPrice = Math.max(0, this.originalPrice - discountAmount);
        
        return discountAmount;
    }

    updateDisplay() {
        const discountDisplay = document.getElementById('discount-display');
        const appliedCodeEl = document.getElementById('applied-code');
        const discountAmountEl = document.getElementById('discount-amount');
        const totalPriceEl = document.getElementById('total-price');

        if (this.appliedCoupon) {
            const discountAmount = this.calculateDiscount();
            const currency = this.appliedCoupon.currency === 'EUR' ? '€' : '$';
            
            if (discountDisplay) discountDisplay.style.display = 'flex';
            if (appliedCodeEl) appliedCodeEl.textContent = this.appliedCoupon.code;
            if (discountAmountEl) discountAmountEl.textContent = `-${currency}${discountAmount.toFixed(2)}`;
            if (totalPriceEl) totalPriceEl.textContent = `${currency}${this.currentPrice.toFixed(2)}`;
        } else {
            if (discountDisplay) discountDisplay.style.display = 'none';
            if (totalPriceEl) totalPriceEl.textContent = `$${this.originalPrice.toFixed(2)}`;
        }
    }

    displayAvailableCoupons(availableCoupons) {
        const container = document.getElementById('available-coupons');
        if (!container || availableCoupons.length === 0) return;

        const couponsHTML = availableCoupons.slice(0, 6).map(coupon => `
            <div class="available-coupon" onclick="couponManager.applyCouponByCode('${coupon.code}')">
                <div class="coupon-code-small">${coupon.code}</div>
                <div class="coupon-desc-small">${coupon.description}</div>
                <div class="coupon-discount-small">
                    ${coupon.type === 'percentage' ? coupon.discount + '% OFF' : 
                      (coupon.currency === 'EUR' ? '€' : '$') + coupon.discount + ' OFF'}
                </div>
                ${coupon.category ? `<div class="coupon-category">${coupon.category.toUpperCase()}</div>` : ''}
            </div>
        `).join('');

        container.innerHTML = `
            <h4>Available Coupons for You</h4>
            <div class="coupons-list">
                ${couponsHTML}
            </div>
        `;
    }

    applyCouponByCode(code) {
        const couponInput = document.getElementById('coupon-input');
        if (couponInput) {
            couponInput.value = code;
            this.applyCoupon();
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('coupon-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `coupon-message ${type}`;
            
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'coupon-message';
            }, 5000);
        }
    }

    removeCoupon() {
        this.appliedCoupon = null;
        this.currentPrice = this.originalPrice;
        this.updateDisplay();
        
        const applyBtn = document.getElementById('apply-coupon');
        if (applyBtn) {
            applyBtn.textContent = 'Apply';
            applyBtn.disabled = false;
        }
    }

    // Utility methods
    setCartItems(items) {
        this.cartItems = items;
    }

    setOriginalPrice(price) {
        this.originalPrice = price;
        this.currentPrice = price;
        this.updateDisplay();
    }

    getFinalPrice() {
        return this.currentPrice;
    }

    getDiscountAmount() {
        return this.originalPrice - this.currentPrice;
    }

    // Method to mark user as having made a booking
    markUserAsBooked() {
        localStorage.setItem('hasBooked', 'true');
        const currentCount = parseInt(localStorage.getItem('bookingCount')) || 0;
        localStorage.setItem('bookingCount', (currentCount + 1).toString());
        localStorage.setItem('lastBookingDate', new Date().toISOString());
        this.userProfile = this.loadUserProfile();
    }
}

// Enhanced CSS for coupon display
const enhancedCouponStyles = `
<style>
#available-coupons {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

#available-coupons h4 {
    color: var(--text-color);
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
}

.coupons-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
}

.available-coupon {
    background: linear-gradient(135deg, var(--color-3), var(--color-4));
    color: white;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.available-coupon::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.available-coupon:hover::before {
    left: 100%;
}

.available-coupon:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(var(--color-3-rgb), 0.4);
}

.coupon-code-small {
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
    letter-spacing: 0.5px;
}

.coupon-desc-small {
    font-size: 0.7rem;
    opacity: 0.9;
    margin-bottom: 0.4rem;
    line-height: 1.2;
}

.coupon-discount-small {
    font-weight: 600;
    font-size: 0.75rem;
    background: rgba(255,255,255,0.25);
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    margin-bottom: 0.3rem;
}

.coupon-category {
    font-size: 0.6rem;
    opacity: 0.8;
    font-weight: 500;
    letter-spacing: 0.3px;
}

@media (max-width: 768px) {
    .coupons-list {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 0.5rem;
    }
    
    .available-coupon {
        padding: 0.6rem;
    }
    
    .coupon-code-small {
        font-size: 0.8rem;
    }
    
    .coupon-desc-small {
        font-size: 0.65rem;
    }
}
</style>
`;

// Add enhanced styles to document
document.head.insertAdjacentHTML('beforeend', enhancedCouponStyles);

// Initialize coupon manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.couponManager = new CouponManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CouponManager;
}
