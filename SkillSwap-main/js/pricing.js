// pricing.js
function redirectToCheckout() {
    // Check if user has already completed a transaction
    const existingTransactions = localStorage.getItem('skillswap_transactions');
    
    if (existingTransactions) {
        const transactions = JSON.parse(existingTransactions);
        if (transactions.length > 0) {
            // User has completed transactions, redirect to return page
            window.location.href = 'return.html';
            return;
        }
    }
    
    // Simulate upgrade process for new users
    const upgradeBtn = document.querySelector('.upgrade-btn');
    const originalText = upgradeBtn.textContent;

    upgradeBtn.textContent = 'Processing...';
    upgradeBtn.disabled = true;

    setTimeout(() => {
        upgradeBtn.textContent = 'Redirecting...';

        setTimeout(() => {
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        }, 1000);
    }, 1500);
}
