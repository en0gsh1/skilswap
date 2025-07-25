// header.js
class HeaderManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateNavigationBasedOnPurchase();
    }

    updateNavigationBasedOnPurchase() {
        // Check if user has made any transactions
        const hasTransactions = this.checkUserTransactions();
        
        // Get all navigation containers
        const navContainers = document.querySelectorAll('.nav-links');
        
        navContainers.forEach(nav => {
            // Find existing pricing or account button
            const existingPricingBtn = nav.querySelector('.pricing-btn');
            const existingAccountBtn = nav.querySelector('.account-btn');
            
            if (hasTransactions) {
                // User has transactions - show Account button
                if (existingPricingBtn) {
                    this.replacePricingWithAccount(existingPricingBtn);
                } else if (!existingAccountBtn) {
                    this.addAccountButton(nav);
                }
            } else {
                // User has no transactions - show Pricing button
                if (existingAccountBtn) {
                    this.replaceAccountWithPricing(existingAccountBtn);
                } else if (!existingPricingBtn) {
                    this.addPricingButton(nav);
                }
            }
        });
    }

    checkUserTransactions() {
        try {
            const transactions = JSON.parse(localStorage.getItem('skillswap_transactions') || '[]');
            return transactions.length > 0;
        } catch (error) {
            console.error('Error checking transactions:', error);
            return false;
        }
    }

    replacePricingWithAccount(pricingBtn) {
        const accountBtn = document.createElement('a');
        accountBtn.href = 'account.html';
        accountBtn.className = 'account-btn';
        accountBtn.setAttribute('data-translate', 'account');
        accountBtn.textContent = 'Account';
        
        pricingBtn.parentNode.replaceChild(accountBtn, pricingBtn);
    }

    replaceAccountWithPricing(accountBtn) {
        const pricingBtn = document.createElement('a');
        pricingBtn.href = 'pricing.html';
        pricingBtn.className = 'pricing-btn';
        pricingBtn.setAttribute('data-translate', 'pricing');
        pricingBtn.textContent = 'Pricing';
        
        accountBtn.parentNode.replaceChild(pricingBtn, accountBtn);
    }

    addAccountButton(nav) {
        const themeToggle = nav.querySelector('.theme-toggle');
        const accountBtn = document.createElement('a');
        accountBtn.href = 'account.html';
        accountBtn.className = 'account-btn';
        accountBtn.setAttribute('data-translate', 'account');
        accountBtn.textContent = 'Account';
        
        if (themeToggle) {
            nav.insertBefore(accountBtn, themeToggle);
        } else {
            nav.appendChild(accountBtn);
        }
    }

    addPricingButton(nav) {
        const themeToggle = nav.querySelector('.theme-toggle');
        const pricingBtn = document.createElement('a');
        pricingBtn.href = 'pricing.html';
        pricingBtn.className = 'pricing-btn';
        pricingBtn.setAttribute('data-translate', 'pricing');
        pricingBtn.textContent = 'Pricing';
        
        if (themeToggle) {
            nav.insertBefore(pricingBtn, themeToggle);
        } else {
            nav.appendChild(pricingBtn);
        }
    }

    // Method to refresh navigation after a transaction
    refreshNavigation() {
        this.updateNavigationBasedOnPurchase();
    }
}

// Initialize header manager
document.addEventListener('DOMContentLoaded', () => {
    window.headerManager = new HeaderManager();
});

// Listen for storage changes (when user completes transaction in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'skillswap_transactions') {
        if (window.headerManager) {
            window.headerManager.refreshNavigation();
        }
    }
});
