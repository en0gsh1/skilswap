// visit-tracker.js
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

// Auto-track visits when page loads
document.addEventListener('DOMContentLoaded', () => {
    const visitTracker = new VisitTracker();
    visitTracker.trackVisit();
});
