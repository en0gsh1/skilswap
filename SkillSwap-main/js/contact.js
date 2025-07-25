// contact.js - Web3Forms JavaScript Integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const result = document.getElementById('result');
    const submitBtn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const replytoInput = document.getElementById('replyto');
    
    if (!form || !submitBtn) {
        console.error('Contact form or submit button not found');
        return;
    }
    
    // Set reply-to email dynamically when user enters their email
    if (emailInput && replytoInput) {
        emailInput.addEventListener('input', function() {
            replytoInput.value = this.value;
        });
    }
    
    // Form submission handler with Web3Forms API
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return false;
        }
        
        // Show loading state
        showLoadingState();
        
        // Prepare form data for Web3Forms
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        // Save form data before submission
        const submissionData = {
            name: object.name,
            email: object.email,
            phone: object.phone || '',
            message: object.message,
            timestamp: new Date().toISOString()
        };
        
        // Show "Please wait..." message
        result.innerHTML = "Please wait...";
        result.style.display = "block";
        result.style.color = "#666";
        result.style.textAlign = "center";
        result.style.marginTop = "1rem";
        result.style.padding = "0.5rem";
        result.style.backgroundColor = "#f0f0f0";
        result.style.borderRadius = "5px";
        
        // Submit to Web3Forms API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let responseJson = await response.json();
            if (response.status == 200) {
                // Success
                saveContactSubmission(submissionData);
                showSuccessMessage();
                result.innerHTML = responseJson.message || "Form submitted successfully";
                result.style.color = "#4CAF50";
                result.style.backgroundColor = "#e8f5e8";
            } else {
                // Error from API
                console.log('API Error:', response);
                showErrorMessage();
                result.innerHTML = responseJson.message || "Something went wrong!";
                result.style.color = "#ef4444";
                result.style.backgroundColor = "#fef2f2";
            }
        })
        .catch(error => {
            // Network or other error
            console.log('Network Error:', error);
            showErrorMessage();
            result.innerHTML = "Something went wrong!";
            result.style.color = "#ef4444";
            result.style.backgroundColor = "#fef2f2";
        })
        .then(function() {
            // Always executed - cleanup
            hideLoadingState();
            
            // Hide result message after 3 seconds
            setTimeout(() => {
                if (result) {
                    result.style.display = "none";
                }
            }, 3000);
        });
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
});

function validateForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    clearFieldError(e);
    
    // Validate based on field type
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        showFieldError(field, 'This field is required');
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            showFieldError(field, 'Please enter a valid email address');
        }
    } else if (field.type === 'tel' && value) {
        // Optional phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            showFieldError(field, 'Please enter a valid phone number');
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    // Remove error message if exists
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
}

function showLoadingState() {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText && btnLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    } else {
        // Fallback if button structure is different
        submitBtn.textContent = 'Sending...';
    }
    
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText && btnLoading) {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    } else {
        // Fallback if button structure is different
        submitBtn.textContent = 'Submit Form';
    }
    
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
}

function showSuccessMessage() {
    const overlay = document.getElementById('message-overlay');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    const form = document.getElementById('contact-form');
    
    if (!overlay || !successMsg) {
        // Fallback alert if overlay doesn't exist
        alert('Message sent successfully! Thank you for contacting us. We\'ll get back to you soon!');
        return;
    }
    
    if (errorMsg) errorMsg.style.display = 'none';
    successMsg.style.display = 'block';
    overlay.style.display = 'flex';
    
    // Reset form after successful submission
    if (form) {
        form.reset();
    }
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeMessage();
    }, 5000);
}

function showErrorMessage() {
    const overlay = document.getElementById('message-overlay');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    
    if (!overlay || !errorMsg) {
        // Fallback alert if overlay doesn't exist
        alert('Oops! Something went wrong. Please try again or contact us directly at info@skillswap.com');
        return;
    }
    
    if (successMsg) successMsg.style.display = 'none';
    errorMsg.style.display = 'block';
    overlay.style.display = 'flex';
}

function closeMessage() {
    const overlay = document.getElementById('message-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Close message overlay when clicking outside
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('message-overlay');
    
    if (overlay && overlay.style.display === 'flex' && e.target === overlay) {
        closeMessage();
    }
});

// Close message overlay with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMessage();
    }
});

// Save contact submission to localStorage for tracking
function saveContactSubmission(data) {
    try {
        const submissions = JSON.parse(localStorage.getItem('skillswap_contact_submissions') || '[]');
        submissions.push(data);
        // Keep only last 10 submissions
        if (submissions.length > 10) {
            submissions.splice(0, submissions.length - 10);
        }
        localStorage.setItem('skillswap_contact_submissions', JSON.stringify(submissions));
        console.log('Contact submission saved:', data);
    } catch (error) {
        console.error('Error saving contact submission:', error);
    }
}
