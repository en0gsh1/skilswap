// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.setupToggle();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggleUI(theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  updateToggleUI(theme) {
    const slider = document.getElementById('theme-slider');
    const icon = slider?.querySelector('.theme-icon');
    
    if (slider && icon) {
      if (theme === 'dark') {
        slider.classList.add('dark');
        icon.textContent = '🌙';
      } else {
        slider.classList.remove('dark');
        icon.textContent = '☀️';
      }
    }
  }

  setupToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.toggleTheme(newTheme);
      });
    }
  }

  toggleTheme(newTheme) {
    // Add transition class for smooth animation
    document.body.classList.add('theme-transition');
    
    // Apply new theme
    this.applyTheme(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }
}

// Initialize theme manager
let themeManager;

// Loading Screen Animation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme first
  themeManager = new ThemeManager();
  
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  if (loadingScreen && mainContent) {
    // Show loading screen for 3 seconds
    setTimeout(() => {
      loadingScreen.classList.add('loading-complete');

      setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';

        // Trigger main content animations
        animateMainContent();
      }, 500);
    }, 3000);
  } else {
    // For pages without loading screen, just initialize theme
    setTimeout(() => {
      themeManager.setupToggle();
    }, 100);
  }
});

function animateMainContent() {
  // Add entrance animations to main content elements
  const heroTitle = document.querySelector('.hero-title');
  const heroDescription = document.querySelector('.hero-description');
  const heroButtons = document.querySelector('.hero-buttons');

  if (heroTitle) {
    heroTitle.style.animation = 'fadeInUp 1s ease-out';
  }

  if (heroDescription) {
    heroDescription.style.animation = 'fadeInUp 1s ease-out 0.2s both';
  }

  if (heroButtons) {
    heroButtons.style.animation = 'fadeInUp 1s ease-out 0.4s both';
  }
}


// FIXED: Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#" or empty
      if (!href || href === '#' || href.length <= 1) {
        e.preventDefault();
        return;
      }
      
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } catch (error) {
        // Handle invalid selectors gracefully
        console.warn('Invalid selector:', href);
        e.preventDefault();
      }
    });
  });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 100) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const bgColor = currentTheme === 'dark' 
        ? 'rgba(26, 26, 46, 0.95)' 
        : 'rgba(248, 250, 252, 0.95)';
      
      header.style.backgroundColor = bgColor;
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.backgroundColor = 'var(--color-1)';
      header.style.backdropFilter = 'none';
    }
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const animatedElements = document.querySelectorAll('.course-card, .team-member, .testimonial-card, .video-course-card, .pricing-card');

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }, 100);
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Simple validation
    if (name && email && message) {
      // Simulate form submission
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          this.reset();
        }, 2000);
      }, 1000);
    }
  });
}

// Video course card interactions
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
  placeholder.addEventListener('click', function() {
    const playButton = this.querySelector('.play-button');
    if (playButton) {
      playButton.style.transform = 'scale(0.9)';

      setTimeout(() => {
        playButton.style.transform = 'scale(1)';
        // Here you would typically open a video modal or navigate to video page
        alert('Video player would open here!');
      }, 150);
    }
  });
});

// Pricing plan interactions
document.querySelectorAll('.upgrade-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Simulate upgrade process
    const originalText = this.textContent;
    this.textContent = 'Processing...';
    this.disabled = true;

    setTimeout(() => {
      this.textContent = 'Redirecting...';

      setTimeout(() => {
        // Here you would typically redirect to payment page
        alert('Redirecting to payment page...');
        this.textContent = originalText;
        this.disabled = false;
      }, 1000);
    }, 1500);
  });
});

// Add hover effects to course cards
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const icon = this.querySelector('.course-image');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  });

  card.addEventListener('mouseleave', function() {
    const icon = this.querySelector('.course-image');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  });
});

// Mobile menu functionality - FIXED VERSION
let mobileMenuBtn = null;

function handleMobileMenu() {
  const header = document.querySelector('.header .container');
  const navLinks = document.querySelector('.nav-links');

  if (window.innerWidth <= 768) {
    // Create mobile menu button if it doesn't exist
    if (!mobileMenuBtn) {
      mobileMenuBtn = document.createElement('button');
      mobileMenuBtn.className = 'mobile-menu-btn';
      mobileMenuBtn.innerHTML = '☰';
      header.appendChild(mobileMenuBtn);

      mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-active');
      });
    }
    mobileMenuBtn.style.display = 'block';
  } else {
    // Hide mobile menu button on larger screens
    if (mobileMenuBtn) {
      mobileMenuBtn.style.display = 'none';
    }
    // Ensure nav links are visible on desktop
    if (navLinks) {
      navLinks.classList.remove('mobile-active');
    }
  }
}

// Initialize mobile menu handling
window.addEventListener('load', handleMobileMenu);
window.addEventListener('resize', handleMobileMenu);

// Close mobile menu when clicking on a link
document.addEventListener('click', function(e) {
  if (e.target.matches('.nav-links a')) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.remove('mobile-active');
    }
  }
});
