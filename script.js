// Language translations
const translations = {
    ru: {
        'form.required': 'Пожалуйста, заполните все поля',
        'form.emailError': 'Пожалуйста, введите корректный email или номер телефона',
        'form.success': 'Сообщение успешно отправлено!',
        'form.error': 'Ошибка отправки сообщения. Попробуйте еще раз.',
        'form.sending': 'Отправка...',
        'modal.title': 'Спасибо за сообщение!',
        'modal.message': 'Мы свяжемся с вами в ближайшее время.',
        'modal.button': 'Закрыть'
    },
    en: {
        'form.required': 'Please fill in all fields',
        'form.emailError': 'Please enter a valid email or phone number',
        'form.success': 'Message sent successfully!',
        'form.error': 'Error sending message. Please try again.',
        'form.sending': 'Sending...',
        'modal.title': 'Thank you for your message!',
        'modal.message': 'We will contact you shortly.',
        'modal.button': 'Close'
    }
};

// Theme and language management
class AppManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'ru';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.applyLanguage(this.currentLanguage);
        this.setupEventListeners();
        this.updateLanguageDisplay();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Close modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Close modal on background click
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.hideModal();
                }
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ru' ? 'en' : 'ru';
        this.applyLanguage(this.currentLanguage);
        localStorage.setItem('language', this.currentLanguage);
        this.updateLanguageDisplay();
        this.updateButtonTexts();
    }

    updateLanguageDisplay() {
        // Update language toggle button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.innerHTML = this.currentLanguage === 'ru' ? 'EN <i class="fas fa-globe"></i>' : 'RU <i class="fas fa-globe"></i>';
        }

        // Show/hide language elements
        document.querySelectorAll('.lang-ru, .lang-en').forEach(el => {
            if (el && el.classList) {
                if (el.classList.contains('lang-ru')) {
                    el.style.display = this.currentLanguage === 'ru' ? 'block' : 'none';
                }
                if (el.classList.contains('lang-en')) {
                    el.style.display = this.currentLanguage === 'en' ? 'block' : 'none';
                }
            }
        });
    }

    updateButtonTexts() {
        const submitBtns = document.querySelectorAll('#submitBtn');
        submitBtns.forEach(btn => {
            if (btn) {
                if (this.currentLanguage === 'ru') {
                    btn.textContent = 'Отправить сообщение';
                } else {
                    btn.textContent = 'Send Message';
                }
            }
        });
    }

    applyLanguage(language) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            if (element && element.getAttribute) {
                const key = element.getAttribute('data-i18n');
                if (translations[language] && translations[language][key]) {
                    element.textContent = translations[language][key];
                }
            }
        });
    }

    showModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}


// Form submission handling
function initializeFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    const appManager = new AppManager();
    
    // Simple email/phone validation regex
    const contactRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    const getTranslation = (key) => translations[appManager.currentLanguage][key] || key;

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const message = document.getElementById('message').value.trim();

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;

            if (!name || !contact || !message) {
                alert(getTranslation('form.required'));
                return;
            }

            if (!contactRegex.test(contact)) {
                alert(getTranslation('form.emailError'));
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = getTranslation('form.sending');

            const formData = { name, contact, message };

            try {
                // Mock API call (replace with your actual backend endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate success
                appManager.showModal();
                contactForm.reset(); 

            } catch (error) {
                console.error('Error submitting form:', error);
                alert(getTranslation('form.error'));
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

// Intersection Observer for scroll animations
function initializeObservers() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fadeIn').forEach(el => {
        el.classList.add('fade-in-on-scroll'); // Add a class to indicate observation
        observer.observe(el);
    });
}

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header behavior on scroll (shrink, color change, etc.)
function initializeHeaderAnimation() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollHandler = () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 1rem';
            header.style.boxShadow = 'var(--shadow)';
        } else {
            header.style.padding = '1rem 1rem';
            header.style.boxShadow = 'none';
        }
    };

    window.addEventListener('scroll', scrollHandler);
    scrollHandler(); // Initialize on load
}

// Initialize modal close handlers
function initializeModalHandlers() {
    const closeModal = document.getElementById('closeModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const successModal = document.getElementById('successModal');

    const close = () => {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (closeModal) {
        closeModal.addEventListener('click', close);
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', close);
    }
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                close();
            }
        });
    }
}

// Hero content animation
function initializeHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
}


// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize header transition
    const header = document.querySelector('header');
    if (header) {
        header.style.transition = 'all 0.3s ease';
    }
    
    // Initialize all components
    new AppManager();
    initializeObservers();
    initializeSmoothScroll();
    // initializeMobileMenu(); // УДАЛЕНО по запросу
    initializeHeaderAnimation();
    initializeModalHandlers();
    initializeHeroAnimation();
    initializeFormSubmission();
});

// Fallback initialization for cases where DOMContentLoaded might have already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeObservers);
} else {
    setTimeout(initializeObservers, 100);
}

// Очистка параметров версии из URL
if (window.location.search.includes('v=')) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
}