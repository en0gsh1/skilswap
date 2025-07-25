// return.js
initialize();

async function initialize() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    
    // Check if we have a valid transaction from checkout
    const transactionCompleted = sessionStorage.getItem('transactionCompleted');
    const transactionId = sessionStorage.getItem('transactionId');
    const customerEmail = sessionStorage.getItem('customerEmail');
    
    // Check if this is a direct access (from browse buttons) or completed transaction
    const isDirectAccess = !transactionCompleted && !sessionId;
    const hasCompletedTransactions = localStorage.getItem('skillswap_transactions');
    
    if (isDirectAccess && hasCompletedTransactions) {
        // Direct access from browse buttons - show success page immediately
        showSuccessPage();
        
        // Get email from existing transactions
        const transactions = JSON.parse(hasCompletedTransactions);
        const latestTransaction = transactions[transactions.length - 1];
        document.getElementById('customer-email').textContent = latestTransaction.email || 'customer@example.com';
        
    } else if (sessionId && sessionId.includes('success') && transactionCompleted) {
        // Coming from checkout with successful payment
        showSuccessPage();
        
        // Set customer email
        document.getElementById('customer-email').textContent = customerEmail || 'customer@example.com';
        
        // Clear session storage after processing
        sessionStorage.removeItem('transactionCompleted');
        sessionStorage.removeItem('customerEmail');
        sessionStorage.removeItem('transactionId');
        
    } else if (!hasCompletedTransactions) {
        // No transactions exist, redirect to checkout
        setTimeout(() => {
            window.location.replace('checkout.html');
        }, 3000);
    } else {
        // Fallback - show success page
        showSuccessPage();
        const transactions = JSON.parse(hasCompletedTransactions);
        const latestTransaction = transactions[transactions.length - 1];
        document.getElementById('customer-email').textContent = latestTransaction.email || 'customer@example.com';
    }
}

function showSuccessPage() {
    // Hide loading and show success
    document.getElementById('loading').style.display = 'none';
    document.getElementById('success').classList.remove('hidden');
    
    // Add save course buttons
    addSaveCourseButtons();
    
    // Add smooth scroll to premium courses after a delay
    setTimeout(() => {
        const premiumCoursesSection = document.querySelector('.premium-courses');
        if (premiumCoursesSection) {
            premiumCoursesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

function addSaveCourseButtons() {
    const courseCards = document.querySelectorAll('.premium-course-card');

    courseCards.forEach((card, index) => {
        // Check if button already exists
        if (card.querySelector('.save-course-btn')) {
            return;
        }
        
        const courseTitle = card.querySelector('h4').textContent;
        const courseDesc = card.querySelector('p').textContent;
        const courseImage = card.querySelector('img').src;

        const saveButton = document.createElement('button');
        saveButton.className = 'save-course-btn';
        saveButton.textContent = 'Save Course';
        saveButton.style.cssText = `
            background: var(--color-3);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: 500;
            transition: background-color 0.3s ease;
        `;
        
        saveButton.onmouseover = () => saveButton.style.backgroundColor = 'var(--color-4)';
        saveButton.onmouseout = () => saveButton.style.backgroundColor = 'var(--color-3)';
        
        saveButton.onclick = () => saveCourse({
            id: 'premium_course_' + index,
            title: courseTitle,
            description: courseDesc,
            image: courseImage,
            category: 'Premium',
            savedAt: new Date().toISOString()
        }, saveButton);

        card.appendChild(saveButton);
    });
}

function saveCourse(course, buttonElement) {
    try {
        // Get existing saved courses
        const savedCourses = JSON.parse(localStorage.getItem('skillswap_saved_courses') || '[]');

        // Check if course is already saved
        const existingCourse = savedCourses.find(c => c.id === course.id);
        if (existingCourse) {
            showMessage('Course already saved!', 'info');
            return;
        }

        // Add new course
        savedCourses.push(course);

        // Save back to localStorage
        localStorage.setItem('skillswap_saved_courses', JSON.stringify(savedCourses));

        // Update button
        buttonElement.textContent = 'Saved ✓';
        buttonElement.disabled = true;
        buttonElement.style.backgroundColor = '#4CAF50';
        buttonElement.style.cursor = 'default';

        showMessage(`"${course.title}" saved successfully!`, 'success');
        
        console.log('Course saved successfully:', course);
    } catch (error) {
        console.error('Error saving course:', error);
        showMessage('Error saving course. Please try again.', 'error');
    }
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.temp-message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `temp-message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ${type === 'success' ? 'background-color: #4CAF50;' : ''}
        ${type === 'error' ? 'background-color: #f44336;' : ''}
        ${type === 'info' ? 'background-color: #2196F3;' : ''}
    `;
    
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none; 
            border: none; 
            color: white; 
            cursor: pointer; 
            margin-left: 10px; 
            font-size: 18px;
            padding: 0;
        ">×</button>
    `;

    document.body.appendChild(messageDiv);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}
