class DashboardManager {
    constructor() {
        this.data = {
            subscribers: 0,
            visits: 0,
            revenue: 0,
            conversionRate: 0,
            visitsData: [],
            subscriptionData: {
                premium: 0,
                basic: 0,
                free: 0
            },
            recentActivity: [],
            transactions: [],
            savedCourses: [],
            usedCoupons: [],
            bookingHistory: []
        };
        this.charts = {};
        this.visitTracker = new VisitTracker();
        this.dataSync = new DataSyncManager();
        this.isInitialized = false;
        this.autoSaveInterval = null;
    }

    async init() {
        if (!this.checkAuthentication()) {
            this.showAccessDenied();
            return;
        }

        // Debug: Check visits data before initialization
        console.log('[DashboardManager] Before init, visitsData:', this.visitTracker.getGlobalVisitData());

        this.showLoading();

        try {
            // Initialize data synchronization
            await this.dataSync.init();
            
            // Load aggregated data from all sources
            await this.loadAggregatedData();
            
            // Initialize dashboard
            this.initializeDashboard();
            
            // Start auto-sync for live updates
            this.startAutoSync();
            
            this.hideLoading();
            this.showDashboard();
            
            this.isInitialized = true;
            console.log('Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            this.hideLoading();
            this.showError('Failed to load dashboard data');
        }
    }

    checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        const loginTime = sessionStorage.getItem('adminLoginTime');
        
        if (!isAuthenticated || !loginTime) {
            return false;
        }

        const sessionDuration = Date.now() - parseInt(loginTime);
        const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionDuration > maxSessionDuration) {
            sessionStorage.removeItem('adminAuthenticated');
            sessionStorage.removeItem('adminLoginTime');
            return false;
        }

        return true;
    }

    async loadAggregatedData() {
        try {
            // Get aggregated data from ALL users (not just admin sessions)
            const aggregatedData = await this.dataSync.getAggregatedData();
            
            this.data.transactions = aggregatedData.transactions || [];
            this.data.savedCourses = aggregatedData.savedCourses || [];
            this.data.usedCoupons = aggregatedData.usedCoupons || [];
            this.data.bookingHistory = aggregatedData.bookingHistory || [];
            
            // Get visit data from global tracking (includes all user visits)
            this.data.visitsData = this.visitTracker.getGlobalVisitData();
            this.data.visits = this.data.visitsData.reduce((sum, day) => sum + day.visits, 0);
            
            // Calculate metrics
            this.calculateMetrics();
            this.generateRecentActivity();
            
            console.log('Aggregated data loaded:', {
                transactions: this.data.transactions.length,
                visits: this.data.visits,
                revenue: this.data.revenue,
                subscribers: this.data.subscribers
            });
            
        } catch (error) {
            console.error('Error loading aggregated data:', error);
            // Fallback to local data
            await this.loadLocalData();
        }
    }

    async loadLocalData() {
        // Load all available data from localStorage
        const transactionsData = localStorage.getItem('skillswap_transactions');
        this.data.transactions = transactionsData ? JSON.parse(transactionsData) : [];

        const savedCoursesData = localStorage.getItem('skillswap_saved_courses');
        this.data.savedCourses = savedCoursesData ? JSON.parse(savedCoursesData) : [];

        const usedCouponsData = localStorage.getItem('skillswap_used_coupons');
        this.data.usedCoupons = usedCouponsData ? JSON.parse(usedCouponsData) : [];

        const bookingHistoryData = localStorage.getItem('skillswap_booking_history');
        this.data.bookingHistory = bookingHistoryData ? JSON.parse(bookingHistoryData) : [];

        // Get global visit data
        this.data.visitsData = this.visitTracker.getGlobalVisitData();
        this.data.visits = this.data.visitsData.reduce((sum, day) => sum + day.visits, 0);

        this.calculateMetrics();
        this.generateRecentActivity();
    }

    calculateMetrics() {
        // Calculate unique subscribers
        const uniqueEmails = new Set();
        this.data.transactions.forEach(t => {
            if (t.email) uniqueEmails.add(t.email.toLowerCase());
        });
        this.data.subscribers = uniqueEmails.size;

        // Calculate total revenue
        this.data.revenue = this.data.transactions.reduce((sum, transaction) => {
            return sum + (parseFloat(transaction.amount) || 0);
        }, 0);

        // Calculate conversion rate
        this.data.conversionRate = this.data.visits > 0 ? 
            ((this.data.subscribers / this.data.visits) * 100).toFixed(1) : 0;

        // Calculate subscription distribution
        const premiumTransactions = this.data.transactions.filter(t => (t.amount || 0) >= 80);
        const basicTransactions = this.data.transactions.filter(t => (t.amount || 0) >= 30 && (t.amount || 0) < 80);
        const freeUsers = this.data.transactions.filter(t => (t.amount || 0) < 30);

        this.data.subscriptionData = {
            premium: premiumTransactions.length,
            basic: basicTransactions.length,
            free: freeUsers.length
        };
    }

    startAutoSync() {
        // Sync data every 15 seconds for more frequent live updates
        this.autoSaveInterval = setInterval(async () => {
            try {
                await this.syncAndRefresh();
            } catch (error) {
                console.error('Auto-sync error:', error);
            }
        }, 15000); // 15 seconds for more responsive updates
    }

    async syncAndRefresh() {
        if (!this.isInitialized) return;

        // Get latest aggregated data from all sources
        const newData = await this.dataSync.getAggregatedData();
        const newVisitData = this.visitTracker.getGlobalVisitData();
        const newVisitCount = newVisitData.reduce((sum, day) => sum + day.visits, 0);
        
        // Check if data has changed
        const hasChanged = 
            newData.transactions.length !== this.data.transactions.length ||
            newData.savedCourses.length !== this.data.savedCourses.length ||
            newData.usedCoupons.length !== this.data.usedCoupons.length ||
            newVisitCount !== this.data.visits;

        if (hasChanged) {
            console.log('Data updated, refreshing dashboard...');
            
            // Update data
            this.data.transactions = newData.transactions;
            this.data.savedCourses = newData.savedCourses;
            this.data.usedCoupons = newData.usedCoupons;
            this.data.bookingHistory = newData.bookingHistory;
            this.data.visitsData = newVisitData;
            this.data.visits = newVisitCount;
            
            // Recalculate metrics
            this.calculateMetrics();
            this.generateRecentActivity();
            
            // Update UI
            this.updateDashboardStats();
            this.renderSummaryStats();
            this.renderRecentActivity();
            this.updateCharts();
            
            // Show notification
            this.showNotification('Dashboard updated with latest data', 'info');
        }
    }

    updateCharts() {
        // Update visits data from global tracking
        this.data.visitsData = this.visitTracker.getGlobalVisitData();
        this.data.visits = this.data.visitsData.reduce((sum, day) => sum + day.visits, 0);
        
        // Reinitialize charts
        this.initializeCharts();
    }

    generateRecentActivity() {
        const activities = [];
        const maxActivities = 15;

        // Add recent transactions
        const recentTransactions = this.data.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        recentTransactions.forEach(transaction => {
            activities.push({
                icon: '💳',
                title: `Premium subscription purchased by ${transaction.name || transaction.email}`,
                time: this.getTimeAgo(transaction.date),
                type: 'purchase',
                timestamp: transaction.date
            });
        });

        // Add recent course saves
        const recentCourses = this.data.savedCourses
            .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
            .slice(0, 4);

        recentCourses.forEach(course => {
            activities.push({
                icon: '📚',
                title: `Course "${course.title}" saved`,
                time: this.getTimeAgo(course.savedAt),
                type: 'course',
                timestamp: course.savedAt
            });
        });

        // Add recent coupon usage
        const recentCoupons = this.data.usedCoupons
            .sort((a, b) => new Date(b.usedDate) - new Date(a.usedDate))
            .slice(0, 3);

        recentCoupons.forEach(coupon => {
            activities.push({
                icon: '🎟️',
                title: `Coupon "${coupon.code}" used - $${(coupon.savings || 0).toFixed(2)} saved`,
                time: this.getTimeAgo(coupon.usedDate),
                type: 'coupon',
                timestamp: coupon.usedDate
            });
        });

        // Add recent visits (aggregate by day)
        const recentVisits = this.data.visitsData
            .filter(day => day.visits > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        recentVisits.forEach(visitDay => {
            activities.push({
                icon: '👥',
                title: `${visitDay.visits} visits recorded`,
                time: this.getTimeAgo(visitDay.date),
                type: 'visit',
                timestamp: visitDay.date
            });
        });

        // Sort by timestamp and limit
        this.data.recentActivity = activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, maxActivities);
    }

    getTimeAgo(dateString) {
        if (!dateString) return 'Unknown time';
        
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} days ago`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks} weeks ago`;
    }

    // UI Methods
    showAccessDenied() {
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('access-denied').style.display = 'block';
    }

    showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('dashboard-content').style.display = 'block';
        document.getElementById('admin-welcome').textContent = `Welcome, Admin`;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    initializeDashboard() {
        this.updateDashboardStats();
        this.renderSummaryStats();
        this.renderRecentActivity();
        
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    updateDashboardStats() {
        const subscribersEl = document.getElementById('subscribers-count');
        if (subscribersEl) subscribersEl.textContent = this.data.subscribers.toLocaleString();

        const visitsEl = document.getElementById('visits-count');
        if (visitsEl) visitsEl.textContent = this.data.visits.toLocaleString();

        const revenueEl = document.getElementById('revenue-count');
        if (revenueEl) revenueEl.textContent = `$${this.data.revenue.toLocaleString()}`;

        const conversionEl = document.getElementById('conversion-rate');
        if (conversionEl) conversionEl.textContent = `${this.data.conversionRate}%`;
    }

    renderSummaryStats() {
        // Transaction Summary
        const transactionContainer = document.getElementById('transaction-summary');
        if (transactionContainer) {
            const totalTransactions = this.data.transactions.length;
            const avgTransaction = totalTransactions > 0 ? (this.data.revenue / totalTransactions).toFixed(2) : 0;

            transactionContainer.innerHTML = `
                <h3 class="chart-title">Transaction Summary</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Transactions:</span>
                        <span class="stat-value">${totalTransactions}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Revenue:</span>
                        <span class="stat-value">$${this.data.revenue.toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Transaction:</span>
                        <span class="stat-value">$${avgTransaction}</span>
                    </div>
                </div>
            `;
        }

        // Coupon Stats
        const couponContainer = document.getElementById('coupon-stats');
        if (couponContainer) {
            const totalCoupons = this.data.usedCoupons.length;
            const totalSavings = this.data.usedCoupons.reduce((sum, coupon) => sum + (coupon.savings || 0), 0);

            couponContainer.innerHTML = `
                <h3 class="chart-title">Coupon Usage</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Coupons Used:</span>
                        <span class="stat-value">${totalCoupons}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Savings:</span>
                        <span class="stat-value">$${totalSavings.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }

        // Course Stats
        const courseContainer = document.getElementById('course-stats');
        if (courseContainer) {
            courseContainer.innerHTML = `
                <h3 class="chart-title">Course Activity</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Courses Saved:</span>
                        <span class="stat-value">${this.data.savedCourses.length}</span>
                    </div>
                </div>
            `;
        }
    }

    renderRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        if (!activityContainer) return;

        if (this.data.recentActivity.length === 0) {
            activityContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--color-4); opacity: 0.7;">
                    <p>No recent activity</p>
                    <small>Activity will appear here as users interact with your platform</small>
                </div>
            `;
            return;
        }

        const activityHTML = this.data.recentActivity.slice(0, 10).map(activity => `
            <div class="activity-item">
                <span class="activity-icon">${activity.icon}</span>
                <div class="activity-details">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');

        activityContainer.innerHTML = activityHTML;
    }

    initializeCharts() {
        try {
            this.initializeVisitsChart();
            this.initializeSubscriptionChart();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    initializeVisitsChart() {
        const ctx = document.getElementById('visitsChart');
        if (!ctx) return;

        if (this.charts.visitsChart) {
            this.charts.visitsChart.destroy();
        }

        if (this.data.visitsData.length === 0) {
            const context = ctx.getContext('2d');
            context.clearRect(0, 0, ctx.width, ctx.height);
            context.font = '16px Arial';
            context.fillStyle = '#666';
            context.textAlign = 'center';
            context.fillText('No visit data available', ctx.width / 2, ctx.height / 2);
            return;
        }

        const labels = this.data.visitsData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const data = this.data.visitsData.map(item => item.visits);

        this.charts.visitsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Visits',
                    data: data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true },
                    x: { 
                        ticks: { maxTicksLimit: 8 }
                    }
                }
            }
        });
    }

    initializeSubscriptionChart() {
        const ctx = document.getElementById('subscriptionChart');
        if (!ctx) return;

        if (this.charts.subscriptionChart) {
            this.charts.subscriptionChart.destroy();
        }

        const data = [
            this.data.subscriptionData.premium,
            this.data.subscriptionData.basic,
            this.data.subscriptionData.free
        ];

        if (data.every(value => value === 0)) {
            const context = ctx.getContext('2d');
            context.clearRect(0, 0, ctx.width, ctx.height);
            context.font = '16px Arial';
            context.fillStyle = '#666';
            context.textAlign = 'center';
            context.fillText('No subscription data', ctx.width / 2, ctx.height / 2);
            return;
        }

        this.charts.subscriptionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Premium', 'Basic', 'Free'],
                datasets: [{
                    data: data,
                    backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '60%'
            }
        });
    }

    exportData() {
        const exportData = {
            summary: {
                totalSubscribers: this.data.subscribers,
                totalVisits: this.data.visits,
                totalRevenue: this.data.revenue,
                conversionRate: this.data.conversionRate
            },
            transactions: this.data.transactions,
            savedCourses: this.data.savedCourses,
            usedCoupons: this.data.usedCoupons,
            visitData: this.data.visitsData,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `skillswap-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Data exported successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px;
            border-radius: 8px; color: white; font-weight: 500; z-index: 10000;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
    }
}

// Enhanced Data Synchronization Manager
class DataSyncManager {
    constructor() {
        this.syncKey = 'skillswap_global_data';
        this.lastSyncKey = 'skillswap_last_sync';
        this.sessionId = this.generateSessionId();
    }

    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    async init() {
        // Initialize global data structure if it doesn't exist
        if (!localStorage.getItem(this.syncKey)) {
            const initialData = {
                transactions: [],
                savedCourses: [],
                usedCoupons: [],
                bookingHistory: [],
                lastUpdated: Date.now(),
                sessions: {}
            };
            localStorage.setItem(this.syncKey, JSON.stringify(initialData));
        }

        // Always sync local data to global storage
        await this.syncAllLocalDataToGlobal();
    }

    getSyncData() {
        try {
            return JSON.parse(localStorage.getItem(this.syncKey)) || {
                transactions: [],
                savedCourses: [],
                usedCoupons: [],
                bookingHistory: [],
                lastUpdated: Date.now(),
                sessions: {}
            };
        } catch (error) {
            console.error('Error parsing sync data:', error);
            return {
                transactions: [],
                savedCourses: [],
                usedCoupons: [],
                bookingHistory: [],
                lastUpdated: Date.now(),
                sessions: {}
            };
        }
    }

    saveSyncData(data) {
        data.lastUpdated = Date.now();
        localStorage.setItem(this.syncKey, JSON.stringify(data));
    }

    async syncAllLocalDataToGlobal() {
        const syncData = this.getSyncData();
        let hasChanges = false;

        // Sync all possible data sources
        const dataSources = [
            { key: 'skillswap_transactions', field: 'transactions', uniqueKey: 'email' },
            { key: 'skillswap_saved_courses', field: 'savedCourses', uniqueKey: 'id' },
            { key: 'skillswap_used_coupons', field: 'usedCoupons', uniqueKey: 'code' },
            { key: 'skillswap_booking_history', field: 'bookingHistory', uniqueKey: 'id' },
            { key: 'skillswap_contact_submissions', field: 'contactSubmissions', uniqueKey: 'email' }
        ];

        dataSources.forEach(source => {
            const localData = this.getLocalData(source.key);
            if (localData.length > 0) {
                if (!syncData[source.field]) {
                    syncData[source.field] = [];
                }
                const newData = this.mergeArrays(syncData[source.field], localData, source.uniqueKey);
                if (newData.length > syncData[source.field].length) {
                    syncData[source.field] = newData;
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            this.saveSyncData(syncData);
            console.log('All local data synced to global storage');
        }
    }

    getLocalData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            return [];
        }
    }

    mergeArrays(existing, newItems, uniqueKey) {
        const existingMap = new Map();
        existing.forEach(item => {
            if (item[uniqueKey]) {
                existingMap.set(item[uniqueKey], item);
            }
        });

        newItems.forEach(item => {
            if (item[uniqueKey] && !existingMap.has(item[uniqueKey])) {
                existingMap.set(item[uniqueKey], item);
            }
        });

        return Array.from(existingMap.values());
    }

    async getAggregatedData() {
        // Always sync latest local data first
        await this.syncAllLocalDataToGlobal();
        
        // Get latest global data
        const syncData = this.getSyncData();

        return {
            transactions: syncData.transactions || [],
            savedCourses: syncData.savedCourses || [],
            usedCoupons: syncData.usedCoupons || [],
            bookingHistory: syncData.bookingHistory || [],
            contactSubmissions: syncData.contactSubmissions || [],
            lastUpdated: syncData.lastUpdated
        };
    }
}

// Global Visit Tracker (tracks ALL user visits)
class VisitTracker {
    constructor() {
        this.globalVisitKey = 'skillswap_global_visits';
        this.sessionKey = 'skillswap_visit_session';
    }

    trackVisit() {
        console.log('[VisitTracker] trackVisit() called');
        // Only track one visit per browser session
        if (!sessionStorage.getItem(this.sessionKey)) {
            this.recordVisit();
            sessionStorage.setItem(this.sessionKey, Date.now().toString());
        }
    }

    recordVisit() {
        const today = new Date().toISOString().split('T')[0];
        console.log(`[VisitTracker] recordVisit() for date ${today}`);
        
        // Get existing visit data
        let globalVisits = JSON.parse(localStorage.getItem(this.globalVisitKey) || '[]');
        
        // Find today's entry or create new one
        const todayIndex = globalVisits.findIndex(entry => entry.date === today);
        if (todayIndex > -1) {
            globalVisits[todayIndex].visits += 1;
        } else {
            globalVisits.push({ date: today, visits: 1 });
        }

        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        globalVisits = globalVisits.filter(entry => entry.date >= cutoffDate);
        globalVisits.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        localStorage.setItem(this.globalVisitKey, JSON.stringify(globalVisits));
        
        console.log('[VisitTracker] Updated visits:', globalVisits);
        console.log(`[VisitTracker] Total visits today: ${globalVisits.find(e => e.date === today)?.visits || 0}`);
    }

    getGlobalVisitData() {
        try {
            const data = JSON.parse(localStorage.getItem(this.globalVisitKey) || '[]');
            
            // Fill in missing days with 0 visits for the last 30 days
            const filledData = [];
            const today = new Date();
            
            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                
                const existingEntry = data.find(entry => entry.date === dateString);
                filledData.push({
                    date: dateString,
                    visits: existingEntry ? existingEntry.visits : 0
                });
            }
            
            return filledData;
        } catch (error) {
            console.error('Error getting global visit data:', error);
            return [];
        }
    }
}

// IMPORTANT: Track visits on ALL pages, not just dashboard
// This should run on every page load
document.addEventListener('DOMContentLoaded', () => {
    // Track visit for ALL users (not just admin)
    const visitTracker = new VisitTracker();
    visitTracker.trackVisit();
    
    // Only initialize dashboard if we're on the dashboard page
    if (document.getElementById('dashboard-content')) {
        window.dashboard = new DashboardManager();
        window.dashboard.init();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});
