class Translator {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.createLanguageToggle();
        this.translatePage();
        this.addEventListeners();
    }

    createLanguageToggle() {
        // Check if language toggle already exists
        if (document.querySelector('.language-toggle')) return;

        // Try to find theme toggle first (for index.html)
        const themeToggle = document.querySelector('.theme-toggle');
        let insertLocation = null;
        let insertMethod = 'after';

        if (themeToggle) {
            // If theme toggle exists, insert after it
            insertLocation = themeToggle;
        } else {
            // If no theme toggle, find the nav-links container
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                insertLocation = navLinks;
                insertMethod = 'append';
            }
        }

        // If we couldn't find either, try the header container
        if (!insertLocation) {
            const headerContainer = document.querySelector('.header .container');
            if (headerContainer) {
                insertLocation = headerContainer;
                insertMethod = 'append';
            }
        }

        // If still no location found, return
        if (!insertLocation) return;

        // Create language toggle container
        const langToggle = document.createElement('div');
        langToggle.className = 'language-toggle';
        langToggle.innerHTML = `
            <button class="language-toggle-btn" id="language-toggle" aria-label="Toggle language">
                <div class="language-toggle-slider" id="language-slider">
                    <span class="language-text">${this.currentLanguage.toUpperCase()}</span>
                </div>
            </button>
        `;

        // Insert the language toggle
        if (insertMethod === 'after') {
            insertLocation.parentNode.insertBefore(langToggle, insertLocation.nextSibling);
        } else {
            insertLocation.appendChild(langToggle);
        }

        // Update slider position based on current language
        this.updateSliderPosition();
    }

    updateSliderPosition() {
        const slider = document.getElementById('language-slider');
        const langText = slider?.querySelector('.language-text');

        if (slider && langText) {
            if (this.currentLanguage === 'sq') {
                slider.classList.add('albanian');
                langText.textContent = 'SQ';
            } else {
                slider.classList.remove('albanian');
                langText.textContent = 'EN';
            }
        }
    }

    addEventListeners() {
        const langToggleBtn = document.getElementById('language-toggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        // Add animation class to body
        document.body.classList.add('language-switching');

        // Animate out current content
        const animatedElements = document.querySelectorAll('[data-translate], h1, h2, h3, p, a, button, input, textarea');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = 'translateY(-20px)';
                el.style.opacity = '0';
            }, index * 10);
        });

        // Switch language after animation
        setTimeout(() => {
            this.currentLanguage = this.currentLanguage === 'en' ? 'sq' : 'en';
            localStorage.setItem('language', this.currentLanguage);

            this.updateSliderPosition();
            this.translatePage();

            // Animate in new content
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.transform = 'translateY(0)';
                    el.style.opacity = '1';
                }, index * 10);
            });

            // Remove animation class
            setTimeout(() => {
                document.body.classList.remove('language-switching');
            }, 1000);
        }, 500);
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[this.currentLanguage][key];
                } else {
                    element.textContent = translations[this.currentLanguage][key];
                }
            }
        });

        // Update document language attribute
        document.documentElement.lang = this.currentLanguage === 'sq' ? 'sq' : 'en';
    }
}

// Initialize translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Translator();
});
