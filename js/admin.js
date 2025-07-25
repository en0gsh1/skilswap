document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
    }, 2000);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeSlider = document.getElementById('theme-slider');
    const themeIcon = themeSlider.querySelector('.theme-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
        themeSlider.classList.add('dark');
        themeIcon.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            themeSlider.classList.add('dark');
            themeIcon.textContent = '🌙';
        } else {
            themeSlider.classList.remove('dark');
            themeIcon.textContent = '☀️';
        }
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            mobileMenuBtn.textContent = navLinks.classList.contains('mobile-active') ? '✕' : '☰';
        });
    }

    // Admin PIN functionality
    const CORRECT_PIN = '6038';
    let currentPin = '';
    
    const pinInput = document.getElementById('pin-input');
    const pinDisplay = document.getElementById('pin-display');
    const pinDots = pinDisplay.querySelectorAll('.pin-dot');
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    const adminForm = document.getElementById('admin-form');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const successModal = document.getElementById('success-modal');

    // Update pin display
    function updatePinDisplay() {
        pinDots.forEach((dot, index) => {
            if (index < currentPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
        pinInput.value = currentPin;
    }

    // Add number to pin
    function addNumber(number) {
        if (currentPin.length < 4) {
            currentPin += number;
            updatePinDisplay();
            hideError();
        }
    }

    // Clear pin
    function clearPin() {
        currentPin = '';
        updatePinDisplay();
        hideError();
    }

    // Remove last digit
    function backspace() {
        if (currentPin.length > 0) {
            currentPin = currentPin.slice(0, -1);
            updatePinDisplay();
            hideError();
        }
    }

    // Show error message
    function showError() {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            hideError();
        }, 3000);
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Show loading state
    function showLoading() {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        loginBtn.disabled = true;
    }

    // Hide loading state
    function hideLoading() {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        loginBtn.disabled = false;
    }

    // Show success modal and redirect
    function showSuccessAndRedirect() {
        successModal.style.display = 'flex';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }

    // Keypad event listeners
    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const number = btn.getAttribute('data-number');
            const action = btn.getAttribute('data-action');
            
            if (number) {
                addNumber(number);
            } else if (action === 'clear') {
                clearPin();
            } else if (action === 'backspace') {
                backspace();
            }
            
            // Add click animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            addNumber(e.key);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            backspace();
        } else if (e.key === 'Delete' || e.key === 'Escape') {
            clearPin();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentPin.length === 4) {
                verifyPin();
            }
        }
    });

    // Form submission
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentPin.length === 4) {
            verifyPin();
        } else {
            showError();
        }
    });

    // Verify PIN function
    function verifyPin() {
        showLoading();
        hideError();
        
        // Simulate authentication delay
        setTimeout(() => {
            if (currentPin === CORRECT_PIN) {
                hideLoading();
                showSuccessAndRedirect();
                
                // Store admin session
                sessionStorage.setItem('adminAuthenticated', 'true');
                sessionStorage.setItem('adminLoginTime', Date.now().toString());
            } else {
                hideLoading();
                showError();
                clearPin();
                
                // Add shake animation to the card
                const adminCard = document.querySelector('.admin-card');
                adminCard.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    adminCard.style.animation = '';
                }, 500);
            }
        }, 1500);
    }

    // Auto-submit when 4 digits are entered
    function checkAutoSubmit() {
        if (currentPin.length === 4) {
            setTimeout(() => {
                verifyPin();
            }, 300);
        }
    }

    // Update the addNumber function to include auto-submit
    const originalAddNumber = addNumber;
    addNumber = function(number) {
        originalAddNumber(number);
        checkAutoSubmit();
    };

    // Security features
    let failedAttempts = 0;
    const maxAttempts = 5;
    let lockoutTime = null;

    function checkLockout() {
        if (lockoutTime && Date.now() < lockoutTime) {
            const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
            showError(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
            return true;
        }
        return false;
    }

    function handleFailedAttempt() {
        failedAttempts++;
        if (failedAttempts >= maxAttempts) {
            lockoutTime = Date.now() + (5 * 60 * 1000); // 5 minutes lockout
            showError('Too many failed attempts. Access locked for 5 minutes.');
        }
    }

    // Update verifyPin function with security
    const originalVerifyPin = verifyPin;
    verifyPin = function() {
        if (checkLockout()) {
            return;
        }
        
        showLoading();
        hideError();
        
        setTimeout(() => {
            if (currentPin === CORRECT_PIN) {
                hideLoading();
                showSuccessAndRedirect();
                
                // Reset failed attempts on success
                failedAttempts = 0;
                lockoutTime = null;
                
                // Store admin session
                sessionStorage.setItem('adminAuthenticated', 'true');
                sessionStorage.setItem('adminLoginTime', Date.now().toString());
            } else {
                hideLoading();
                handleFailedAttempt();
                showError();
                clearPin();
                
                // Add shake animation to the card
                const adminCard = document.querySelector('.admin-card');
                adminCard.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    adminCard.style.animation = '';
                }, 500);
            }
        }, 1500);
    };

    // Enhanced error message function
    const originalShowError = showError;
    showError = function(customMessage = null) {
        const errorText = errorMessage.querySelector('.error-text');
        if (customMessage) {
            errorText.textContent = customMessage;
        } else {
            errorText.textContent = 'Invalid PIN. Please try again.';
        }
        
        errorMessage.style.display = 'block';
        
        if (!customMessage) {
            setTimeout(() => {
                hideError();
            }, 3000);
        }
    };

    // Check if already authenticated
    function checkExistingAuth() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        const loginTime = sessionStorage.getItem('adminLoginTime');
        
        if (isAuthenticated && loginTime) {
            const sessionDuration = 30 * 60 * 1000; // 30 minutes
            const currentTime = Date.now();
            
            if (currentTime - parseInt(loginTime) < sessionDuration) {
                // Still within session time, redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Session expired, clear storage
                sessionStorage.removeItem('adminAuthenticated');
                sessionStorage.removeItem('adminLoginTime');
            }
        }
    }

    // Check authentication on page load
    checkExistingAuth();

    // Add visual feedback for keypad interactions
    function addKeypadFeedback() {
        keypadBtns.forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.95)';
                btn.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
            });
            
            btn.addEventListener('mouseup', () => {
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.style.boxShadow = '';
                }, 100);
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
        });
    }

    addKeypadFeedback();

    // Add sound effects (optional)
    function playSound(type) {
        // Create audio context for sound effects
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            
            if (type === 'click') {
                // Short beep for keypad clicks
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } else if (type === 'error') {
                // Error sound
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'success') {
                // Success sound
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }
        }
    }

    // Add sound to keypad clicks (optional - can be enabled/disabled)
    const soundEnabled = false; // Set to true to enable sounds
    
    if (soundEnabled) {
        keypadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                playSound('click');
            });
        });
    }

    // Update error and success functions to include sound
    const originalShowErrorWithSound = showError;
    showError = function(customMessage = null) {
        if (soundEnabled) playSound('error');
        originalShowErrorWithSound(customMessage);
    };

    const originalShowSuccessAndRedirectWithSound = showSuccessAndRedirect;
    showSuccessAndRedirect = function() {
        if (soundEnabled) playSound('success');
        originalShowSuccessAndRedirectWithSound();
    };

    // Add focus management for accessibility
    function manageFocus() {
        // Focus on the first keypad button when page loads
        setTimeout(() => {
            const firstKeypadBtn = document.querySelector('.keypad-btn[data-number="1"]');
            if (firstKeypadBtn) {
                firstKeypadBtn.focus();
            }
        }, 2100); // After loading screen
    }

    manageFocus();

    // Add keyboard navigation for keypad
    document.addEventListener('keydown', (e) => {
        const focusedElement = document.activeElement;
        
        if (focusedElement && focusedElement.classList.contains('keypad-btn')) {
            let nextElement = null;
            
            switch(e.key) {
                case 'ArrowRight':
                    nextElement = focusedElement.nextElementSibling;
                    break;
                case 'ArrowLeft':
                    nextElement = focusedElement.previousElementSibling;
                    break;
                case 'ArrowDown':
                    // Move to next row
                    const currentIndex = Array.from(keypadBtns).indexOf(focusedElement);
                    if (currentIndex + 3 < keypadBtns.length) {
                        nextElement = keypadBtns[currentIndex + 3];
                    }
                    break;
                case 'ArrowUp':
                    // Move to previous row
                    const currentIndexUp = Array.from(keypadBtns).indexOf(focusedElement);
                    if (currentIndexUp - 3 >= 0) {
                        nextElement = keypadBtns[currentIndexUp - 3];
                    }
                    break;
            }
            
            if (nextElement) {
                e.preventDefault();
                nextElement.focus();
            }
        }
    });

    // Add loading screen fade out effect
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 50);
        }, 300);
    }, 1800);

    console.log('Admin panel initialized successfully');
});
