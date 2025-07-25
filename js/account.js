class AccountManager {
    constructor() {
        this.user = null;
        this.savedCourses = [];
        this.transactions = [];
        this.usedCoupons = [];
        this.currentTab = 'saved-courses';
    }

    async init() {
        try {
            await this.loadUserData();
            await this.loadSavedCourses();
            await this.loadTransactions();
            await this.loadUsedCoupons();
            this.setupEventListeners();
            this.renderContent();
        } catch (error) {
            console.error('Error initializing account:', error);
            this.showError('Failed to load account data');
        }
    }

    async loadUserData() {
        // Simulate loading user data
        this.user = {
            name: 'John Doe',
            email: localStorage.getItem('userEmail') || 'user@example.com',
            joinDate: '2024-01-15',
            membershipType: 'Premium',
            avatar: 'https://via.placeholder.com/100x100?text=JD'
        };
    }

    async loadSavedCourses() {
        try {
            const saved = localStorage.getItem('skillswap_saved_courses');
            this.savedCourses = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved courses:', error);
            this.savedCourses = [];
        }
    }

    async loadTransactions() {
        try {
            const transactions = localStorage.getItem('skillswap_transactions');
            this.transactions = transactions ? JSON.parse(transactions) : [];
            
            // Add sample transactions if none exist
            if (this.transactions.length === 0) {
                this.transactions = [
                    {
                        id: 'TXN001',
                        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                        course: 'Advanced JavaScript Mastery',
                        amount: 149.99,
                        originalAmount: 199.99,
                        discount: 50.00,
                        couponCode: 'SAVE25',
                        paymentMethod: 'Credit Card',
                        status: 'completed'
                    },
                    {
                        id: 'TXN002',
                        date: new Date(Date.now() - 604800000).toISOString(), // Last week
                        course: 'React Development Bootcamp',
                        amount: 89.99,
                        originalAmount: 89.99,
                        discount: 0,
                        couponCode: null,
                        paymentMethod: 'PayPal',
                        status: 'completed'
                    }
                ];
                localStorage.setItem('skillswap_transactions', JSON.stringify(this.transactions));
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.transactions = [];
        }
    }

    async loadUsedCoupons() {
        try {
            const coupons = localStorage.getItem('skillswap_used_coupons');
            this.usedCoupons = coupons ? JSON.parse(coupons) : [];
        } catch (error) {
            console.error('Error loading used coupons:', error);
            this.usedCoupons = [];
        }
    }

    setupEventListeners() {
        // Tab navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('show-available-coupons-btn')) {
                this.showAvailableCoupons();
            }
            if (e.target.classList.contains('close-modal')) {
                e.target.closest('.coupon-modal').remove();
            }
            if (e.target.classList.contains('start-course-btn')) {
                const courseId = e.target.closest('[data-course-id]').getAttribute('data-course-id');
                this.startCourse(courseId);
            }
            if (e.target.classList.contains('remove-course-btn')) {
                const courseId = e.target.closest('[data-course-id]').getAttribute('data-course-id');
                this.removeCourse(courseId);
            }
            // Fix for Browse Courses buttons
            if (e.target.textContent === 'Browse Courses' && e.target.tagName === 'A') {
                e.preventDefault();
                window.location.href = 'courses.html';
            }
        });

        // Listen for new courses being saved from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'skillswap_saved_courses') {
                this.loadSavedCourses().then(() => {
                    if (this.currentTab === 'saved-courses') {
                        this.renderSavedCourses();
                    }
                });
            }
        });
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Render content for the active tab
        switch(tabName) {
            case 'saved-courses':
                this.renderSavedCourses();
                break;
            case 'transactions':
                this.renderTransactions();
                break;
            case 'coupons':
                this.renderUsedCoupons();
                break;
        }
    }

    renderContent() {
        this.renderSavedCourses();
        this.renderTransactions();
        this.renderUsedCoupons();
    }

renderSavedCourses() {
    const container = document.getElementById('saved-courses-container');
    if (!container) return;

    if (this.savedCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>No Saved Courses Yet</h3>
                <p>Start building your learning library by saving courses that interest you.</p>
                <a href="return.html">Browse Premium Courses</a>
            </div>
        `;
        return;
    }

    const coursesHTML = this.savedCourses.map((course, index) => this.createCourseCard(course, index)).join('');
    container.innerHTML = coursesHTML;
}

    createCourseCard(course, index) {
        const savedDate = new Date(course.savedAt || Date.now()).toLocaleDateString();
        const progress = Math.floor(Math.random() * 100); // Simulate progress
        
        return `
            <div class="saved-course-card" data-course-id="${course.id}" style="animation-delay: ${index * 0.1}s">
                <div class="course-header">
                    <div class="course-image">
                        <img src="${course.image || 'imgs/default-course.jpg'}" alt="${course.title}" loading="lazy">
                    </div>
                    <h3 class="course-title">${course.title}</h3>
                    <span class="course-category">${course.category || 'General'}</span>
                    <div class="course-stats">
                        <div class="stat-item">
                            <span class="stat-number">${course.duration || '8'}</span>
                            <span class="stat-label">Hours</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${course.lessons || '24'}</span>
                            <span class="stat-label">Lessons</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${progress}%</span>
                            <span class="stat-label">Progress</span>
                        </div>
                    </div>
                </div>
                <div class="course-content">
                    <p class="course-description">${course.description || 'Learn essential skills with this comprehensive course designed for all skill levels.'}</p>
                    
                    <div class="course-tags">
                        ${(course.tags || ['Beginner', 'Popular']).map(tag => `<span class="course-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="course-meta">
                        <div class="saved-date">Saved ${savedDate}</div>
                        <div class="course-progress">Progress: ${progress}%</div>
                    </div>
                    
                    <div class="course-actions">
                        <button class="start-course-btn">
                            Start Course
                        </button>
                        <button class="remove-course-btn">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

renderTransactions() {
    const container = document.getElementById('transactions-container');
    if (!container) return;

    if (this.transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💳</div>
                <h3>No Transactions Yet</h3>
                <p>Your purchase history will appear here once you start buying courses.</p>
                <a href="return.html">Browse Premium Courses</a>
            </div>
        `;
        return;
    }


        const transactionsHTML = this.transactions.map(transaction => `
            <div class="transaction-card">
                <div class="transaction-header">
                    <div>
                        <h3 class="transaction-id">Transaction ${transaction.id}</h3>
                        <p class="transaction-date">${new Date(transaction.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    <span class="transaction-status status-${transaction.status}">${transaction.status}</span>
                </div>
                
                <div class="transaction-details">
                    <div class="detail-item">
                        <h4>Course</h4>
                        <p>${transaction.course}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Payment Method</h4>
                        <p>${transaction.paymentMethod}</p>
                    </div>
                    ${transaction.couponCode ? `
                        <div class="detail-item">
                            <h4>Coupon Applied</h4>
                            <p>${transaction.couponCode}</p>
                        </div>
                    ` : ''}
                    ${transaction.discount > 0 ? `
                        <div class="detail-item">
                            <h4>Discount</h4>
                            <p>-$${transaction.discount.toFixed(2)}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="transaction-amount">
                    ${transaction.originalAmount > transaction.amount ? `
                        <p style="text-decoration: line-through; opacity: 0.6; margin-bottom: 0.5rem;">
                            Original: $${transaction.originalAmount.toFixed(2)}
                        </p>
                    ` : ''}
                    <div class="final-amount">$${transaction.amount.toFixed(2)}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = transactionsHTML;
    }

renderUsedCoupons() {
    const container = document.getElementById('coupons-container');
    if (!container) return;

    if (this.usedCoupons.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎫</div>
                <h3>No Coupons Used Yet</h3>
                <p>When you use discount coupons during checkout, they'll appear here for your reference.</p>
                <div class="empty-state-actions">
                    <a href="return.html" class="cta-button">Browse Premium Courses</a>
                    <button class="secondary-button show-available-coupons-btn">View Available Coupons</button>
                </div>
            </div>
        `;
        return;
    }
        // Calculate total savings
        const totalSavings = this.usedCoupons.reduce((sum, coupon) => sum + coupon.savings, 0);
        
        const couponsHTML = this.usedCoupons
            .sort((a, b) => new Date(b.usedDate) - new Date(a.usedDate))
            .map(coupon => `
                <div class="coupon-card">
                    <div class="coupon-header">
                        <div class="coupon-code">${coupon.code}</div>
                        <div class="coupon-savings">
                            Saved: ${coupon.currency === 'EUR' ? '€' : '$'}${coupon.savings.toFixed(2)}
                        </div>
                    </div>
                    <p class="coupon-description">${coupon.description}</p>
                    <div class="coupon-details">
                        <div class="coupon-detail-row">
                            <div class="coupon-detail-item">
                                <span class="detail-label">Original Amount:</span>
                                <span class="detail-value">
                                    ${coupon.currency === 'EUR' ? '€' : '$'}${coupon.originalAmount.toFixed(2)}
                                </span>
                            </div>
                            <div class="coupon-detail-item">
                                <span class="detail-label">Final Amount:</span>
                                <span class="detail-value final-amount">
                                    ${coupon.currency === 'EUR' ? '€' : '$'}${coupon.finalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div class="coupon-detail-row">
                            <div class="coupon-detail-item">
                                <span class="detail-label">Discount:</span>
                                <span class="detail-value discount-value">
                                    ${coupon.type === 'percentage' ? 
                                      coupon.discount + '%' : 
                                      (coupon.currency === 'EUR' ? '€' : '$') + coupon.discount
                                    }
                                </span>
                            </div>
                            <div class="coupon-detail-item">
                                <span class="detail-label">Used Date:</span>
                                <span class="detail-value">
                                    ${new Date(coupon.usedDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

        container.innerHTML = `
            <div class="coupons-summary">
                <div class="summary-card">
                    <div class="summary-icon">💰</div>
                    <div class="summary-content">
                        <h4>Total Savings</h4>
                        <div class="summary-amount">$${totalSavings.toFixed(2)}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">🎫</div>
                    <div class="summary-content">
                        <h4>Coupons Used</h4>
                        <div class="summary-amount">${this.usedCoupons.length}</div>
                    </div>
                </div>
            </div>
            <div class="coupons-list">
                ${couponsHTML}
            </div>
        `;
    }
showAvailableCoupons() {
    // Remove any existing modal
    const existingModal = document.querySelector('.coupon-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'coupon-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <div class="modal-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                border-bottom: 1px solid #eee;
                padding-bottom: 1rem;
            ">
                <h3 style="margin: 0; color: #333;">Available Coupons</h3>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: #666;">Check out our current promotions and available discount codes:</p>
                <ul class="available-coupons-list" style="
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem 0;
                ">
                    <li style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        background: #f8f9fa;
                        border-radius: 5px;
                        border-left: 4px solid #007bff;
                    "><strong>SKILLSWAP10</strong> - 10% off first booking</li>
                    <li style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        background: #f8f9fa;
                        border-radius: 5px;
                        border-left: 4px solid #28a745;
                    "><strong>WELCOME15</strong> - 15% off any purchase</li>
                    <li style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        background: #f8f9fa;
                        border-radius: 5px;
                        border-left: 4px solid #ffc107;
                    "><strong>STUDENT20</strong> - 20% off with valid student email</li>
                    <li style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        background: #f8f9fa;
                        border-radius: 5px;
                        border-left: 4px solid #dc3545;
                    "><strong>BUNDLE30</strong> - 30% off bundled courses</li>
                    <li style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        background: #f8f9fa;
                        border-radius: 5px;
                        border-left: 4px solid #6f42c1;
                    "><strong>REFER10</strong> - 10% off when you refer a friend</li>
                </ul>
                <div class="modal-actions" style="
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                ">
                    <a href="return.html" class="cta-button" style="
                        color: white;
                        text-decoration: none;
                        font-weight: 600;
                        padding: 1rem 2rem;
                        background: linear-gradient(135deg, var(--color-3), var(--color-4));
                        border-radius: 12px;
                        transition: all 0.3s ease;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(var(--color-3-rgb), 0.3);
                    ">Browse Premium Courses</a>
                    <button class="close-modal secondary-button" style="
                        background: transparent;
                        color: var(--color-3);
                        border: 2px solid var(--color-3);
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-decoration: none;
                        display: inline-block;
                        font-family: 'Poppins', sans-serif;
                    ">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
    // Function to show new course added message
    showNewCourseMessage(courseName) {
        const message = document.createElement('div');
        message.className = 'new-course-message';
        message.innerHTML = `
            <span>Course "${courseName}" has been saved successfully!</span>
            <button class="close-btn" onclick="this.parentElement.remove()">×</button>
        `;
        
        const container = document.querySelector('.saved-courses-grid');
        if (container) {
            container.parentNode.insertBefore(message, container);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 5000);
        }
    }

    // Function to add new course with animation
    addNewCourse(courseData) {
        const courseCard = this.createCourseCard(courseData, 0);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = courseCard;
        const newCard = tempDiv.firstElementChild;
        newCard.classList.add('new-course');
        
        const container = document.querySelector('.saved-courses-grid');
        if (container) {
            container.insertBefore(newCard, container.firstChild);
            
            // Remove new-course class after animation
            setTimeout(() => {
                newCard.classList.remove('new-course');
            }, 600);
            
            // Show success message
            this.showNewCourseMessage(courseData.title);
        }
    }

    startCourse(courseId) {
        const course = this.savedCourses.find(c => c.id === courseId);
        if (course) {
            // Show loading state
            const button = document.querySelector(`[data-course-id="${courseId}"] .start-course-btn`);
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Loading...';
                button.disabled = true;
                
                // Simulate course starting
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    
                    // Redirect to course or show course content
                    this.showSuccess(`Starting "${course.title}"! Redirecting to course...`);
                    
                    // Simulate redirect after 2 seconds
                    setTimeout(() => {
                        // In a real app, you would redirect to the course page
                        // window.location.href = `course.html?id=${courseId}`;
                        alert(`Course "${course.title}" would start here!`);
                    }, 2000);
                }, 1000);
            }
        }
    }

    removeCourse(courseId) {
        const course = this.savedCourses.find(c => c.id === courseId);
        if (!course) return;

        if (confirm(`Are you sure you want to remove "${course.title}" from your saved courses?`)) {
            // Add removal animation
            const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
            if (courseCard) {
                courseCard.style.transform = 'translateX(-100%)';
                courseCard.style.opacity = '0';
                
                setTimeout(() => {
                    this.savedCourses = this.savedCourses.filter(c => c.id !== courseId);
                    localStorage.setItem('skillswap_saved_courses', JSON.stringify(this.savedCourses));
                    this.renderSavedCourses();
                    this.showSuccess(`"${course.title}" has been removed from your saved courses.`);
                }, 300);
            }
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto; padding: 0.2rem;">×</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    // Method to be called from other pages when a course is saved
    static addCourseFromExternal(courseData) {
        if (window.accountManager) {
            window.accountManager.savedCourses.unshift({
                ...courseData,
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('skillswap_saved_courses', JSON.stringify(window.accountManager.savedCourses));
            
            if (window.accountManager.currentTab === 'saved-courses') {
                window.accountManager.addNewCourse(courseData);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.accountManager = new AccountManager();
    accountManager.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccountManager;
}
