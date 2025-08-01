// Main JavaScript file for the Computer Education Department website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initThemeToggle();
    initScrollToTop();
    initAnimatedCounters();
    initContactForm();
    initApplyForm();
    initSmoothScrolling();
    initScrollAnimations();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
        } else {
            themeIcon.className = 'bi bi-moon-fill';
        }
    }
}

// Scroll to top button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animated counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const animationDuration = 2000; // 2 seconds
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / (animationDuration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(function() {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
        
        // Add animation class
        element.style.animation = 'countUp 0.6s ease-out';
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (validateContactForm(data)) {
                // Simulate form submission
                showSuccessMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
                contactForm.reset();
            }
        });
    }
}

// Apply form functionality
function initApplyForm() {
    const applyForm = document.getElementById('applyForm');
    
    if (applyForm) {
        applyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const data = {
                name: document.getElementById('studentName').value,
                email: document.getElementById('studentEmail').value,
                phone: document.getElementById('studentPhone').value,
                grade: document.getElementById('highSchoolGrade').value,
                motivation: document.getElementById('motivation').value
            };
            
            // Validate form
            if (validateApplyForm(data)) {
                // Simulate form submission
                showSuccessMessage('تم تقديم طلبك بنجاح! سنتواصل معك لاستكمال إجراءات القبول.');
                applyForm.reset();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
                modal.hide();
            }
        });
    }
}

// Form validation functions
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('الاسم مطلوب');
    }
    
    if (!data.email.trim()) {
        errors.push('البريد الإلكتروني مطلوب');
    } else if (!isValidEmail(data.email)) {
        errors.push('البريد الإلكتروني غير صحيح');
    }
    
    if (!data.subject.trim()) {
        errors.push('الموضوع مطلوب');
    }
    
    if (!data.message.trim()) {
        errors.push('الرسالة مطلوبة');
    }
    
    if (errors.length > 0) {
        showErrorMessage('يرجى تصحيح الأخطاء التالية:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

function validateApplyForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('الاسم مطلوب');
    }
    
    if (!data.email.trim()) {
        errors.push('البريد الإلكتروني مطلوب');
    } else if (!isValidEmail(data.email)) {
        errors.push('البريد الإلكتروني غير صحيح');
    }
    
    if (!data.phone.trim()) {
        errors.push('رقم الهاتف مطلوب');
    }
    
    if (!data.grade || data.grade < 50 || data.grade > 100) {
        errors.push('درجة الثانوية العامة يجب أن تكون بين 50 و 100');
    }
    
    if (!data.motivation.trim()) {
        errors.push('يرجى كتابة دوافعك لدراسة معلم الحاسب الآلي');
    }
    
    if (errors.length > 0) {
        showErrorMessage('يرجى تصحيح الأخطاء التالية:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    // Create and show a success toast/alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function showErrorMessage(message) {
    // Create and show an error toast/alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px; white-space: pre-line;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 7 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 7000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a Bootstrap toggle or modal trigger
            if (this.hasAttribute('data-bs-toggle') || this.hasAttribute('data-bs-target')) {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-item, .feature-card, .career-card, .faculty-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active nav link highlighting if on main page
if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    updateActiveNavLink();
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance monitoring
function logPerformance() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Enable performance logging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Don't show error alerts in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        showErrorMessage('حدث خطأ تقني. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
    }
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js');
    });
}