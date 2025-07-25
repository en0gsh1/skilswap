// This is your test publishable API key.
const stripe = Stripe("pk_test_51PmTaV2NSoPn2t3pdc56LSypEyGXpwQvvKsWs39j8ngKcQsvOViLSMbEgtSp9Uuh241Kt0wdWJuqqecqizDQavYA00CtUdtxWd");

initialize();

// Create a Checkout Session
async function initialize() {
    createSimulatedCheckout();
}

function createSimulatedCheckout() {
    const checkoutDiv = document.getElementById('checkout');

    checkoutDiv.innerHTML = `
        <div class="simulated-checkout">
            <h3>Payment Details</h3>
            <form id="payment-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="your@email.com">
                </div>

                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" name="card-number" required placeholder="1234 5678 9012 3456" maxlength="19">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="expiry">MM/YY</label>
                        <input type="text" id="expiry" name="expiry" required placeholder="12/25" maxlength="5">
                    </div>
                    <div class="form-group">
                        <label for="cvc">CVC</label>
                        <input type="text" id="cvc" name="cvc" required placeholder="123" maxlength="3">
                    </div>
                </div>

                <div class="form-group">
                    <label for="name">Cardholder Name</label>
                    <input type="text" id="name" name="name" required placeholder="John Doe">
                </div>

                <button type="submit" id="submit-payment" class="payment-btn">
                    Complete Payment - $100.00
                </button>
            </form>
        </div>
    `;

    // Add form styling
    const style = document.createElement('style');
    style.textContent = `
        .simulated-checkout {
            max-width: 400px;
            margin: 0 auto;
        }

        .simulated-checkout h3 {
            color: var(--color-4);
            margin-bottom: 2rem;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--color-4);
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid var(--color-2);
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--color-3);
        }

        .payment-btn {
            width: 100%;
            background-color: var(--color-3);
            color: white;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 1rem;
        }

        .payment-btn:hover {
            background-color: var(--color-4);
        }

        .payment-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // Add form submission handler
    document.getElementById('payment-form').addEventListener('submit', handlePayment);

    // Add input formatting
    formatCardInputs();
}

function formatCardInputs() {
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');

    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
        e.target.value = formattedValue;
    });

    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
}

async function handlePayment(event) {
    event.preventDefault();

    const submitButton = document.getElementById('submit-payment');
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;

    // Simulate payment processing
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Get applied coupon from coupon manager if exists
    let appliedCoupon = null;
    if (window.couponManager && window.couponManager.appliedCoupon) {
        appliedCoupon = window.couponManager.appliedCoupon;
    }

    // Create transaction object
    const transaction = {
        id: 'txn_' + Date.now(),
        email: email,
        name: name,
        amount: appliedCoupon ? window.couponManager.currentPrice : 100,
        originalAmount: 100,
        coupon: appliedCoupon,
        date: new Date().toISOString(),
        status: 'completed',
        type: 'premium_subscription',
        course: 'Premium Subscription',
        paymentMethod: 'Credit Card'
    };

    // Simulate API call delay
    setTimeout(() => {
        // Save transaction to localStorage
        saveTransaction(transaction);
        
        // Set session storage to indicate successful transaction
        sessionStorage.setItem('transactionCompleted', 'true');
        sessionStorage.setItem('transactionId', transaction.id);
        sessionStorage.setItem('customerEmail', email);

        // Redirect to return page with success parameter
        window.location.href = 'return.html?session_id=sim_success_' + transaction.id;
    }, 2000);
}

function saveTransaction(transaction) {
    try {
        // Get existing transactions
        const existingTransactions = JSON.parse(localStorage.getItem('skillswap_transactions') || '[]');
        
        // Add new transaction
        existingTransactions.push(transaction);
        
        // Save back to localStorage
        localStorage.setItem('skillswap_transactions', JSON.stringify(existingTransactions));
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'skillswap_transactions',
            newValue: JSON.stringify(existingTransactions)
        }));
        
        console.log('Transaction saved successfully:', transaction);
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}
