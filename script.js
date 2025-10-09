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
        const themeToggle = qs('#themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.currentTheme = newTheme;
                localStorage.setItem('theme', newTheme);
            });
        }

        // Language toggle
        const langToggle = qs('#langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLanguage = this.currentLanguage === 'ru' ? 'en' : 'ru';
                this.applyLanguage(newLanguage);
                this.currentLanguage = newLanguage;
                localStorage.setItem('language', newLanguage);
                this.updateLanguageDisplay();
            });
        }
    }

    applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        const icon = qs('#themeToggle i');
        if (icon) {
            icon.classList.remove('fa-sun', 'fa-moon');
            icon.classList.add(theme === 'light' ? 'fa-moon' : 'fa-sun');
        }
    }

    applyLanguage(lang) {
        document.body.lang = lang;
        this.translateContent(lang);
    }

    translateContent(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang] ? translations[lang][key] : key;
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Update form button text
        const submitBtnRu = qs('#submitBtn.lang-ru');
        const submitBtnEn = qs('#submitBtn.lang-en');
        
        if (submitBtnRu && submitBtnEn) {
            submitBtnRu.style.display = lang === 'ru' ? 'inline-block' : 'none';
            submitBtnEn.style.display = lang === 'en' ? 'inline-block' : 'none';
        }
    }
    
    updateLanguageDisplay() {
        document.querySelectorAll('.lang-ru, .lang-en').forEach(el => {
            if (el.classList.contains('lang-ru')) {
                el.style.display = this.currentLanguage === 'ru' ? 'block' : 'none';
            } else if (el.classList.contains('lang-en')) {
                el.style.display = this.currentLanguage === 'en' ? 'block' : 'none';
            }
        });
    }
}

// Global utility functions
const qs = selector => document.querySelector(selector);
const qsa = selector => document.querySelectorAll(selector);

// Form handling (Simplified for client-side feedback)
function initializeFormHandler() {
    const form = qs('#contactForm');
    const formMessage = qs('#formMessage');
    const submitBtn = qs('#submitBtn');
    const modal = qs('#successModal');
    const closeModal = qs('#closeModal');
    const modalCloseBtn = qs('#modalCloseBtn');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            formMessage.style.display = 'none';
            
            // Basic validation
            const name = qs('#name').value.trim();
            const email = qs('#email').value.trim();
            const message = qs('#message').value.trim();
            const lang = document.body.lang;
            
            if (!name || !email || !message) {
                formMessage.textContent = translations[lang]['form.required'];
                formMessage.classList.remove('success', 'error');
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                return;
            }
            
            // Mock submission
            submitBtn.disabled = true;
            submitBtn.textContent = translations[lang]['form.sending'];

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success modal
            modal.classList.add('active');
            
            // Reset form
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = lang === 'ru' ? 'Отправить сообщение' : 'Send Message';
        });

        // Close modal handlers
        const closeModals = [closeModal, modalCloseBtn];
        closeModals.forEach(el => {
            if (el) {
                el.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            }
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Observer for fade-in animations
function initializeObservers() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');

                // Skill bar animation logic
                if (entry.target.classList.contains('skill-item')) {
                    const skillProgress = entry.target.querySelector('.skill-progress');
                    const width = skillProgress.getAttribute('data-width');
                    skillProgress.style.setProperty('--progress-width', width);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    qsa('.animate-fadeIn').forEach(element => {
        observer.observe(element);
    });
}

// Header transition on scroll (to remove glass effect when scrolling down)
function initializeHeaderAnimation() {
    const header = qs('header');
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 50; 

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > scrollThreshold) {
            header.classList.remove('glass-dark');
            header.style.boxShadow = 'var(--shadow)';
        } else {
            header.classList.add('glass-dark');
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
}

// Modal handlers are initialized within form handler, but let's keep the name consistent
function initializeModalHandlers() {
    // Logic is in initializeFormHandler now.
}

// Smooth scroll logic
function initializeSmoothScroll() {
    qsa('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = qs(targetId);

            if (targetElement) {
                // Determine offset for fixed header
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const headerHeight = qs('header').offsetHeight;
                
                window.scrollTo({
                    top: offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
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
    // Initialize App Manager (Theme/Lang)
    new AppManager();
    
    // Initialize header transition
    const header = document.querySelector('header');
    if (header) {
        header.style.transition = 'all 0.3s ease';
    }
    
    // Initialize all components
    initializeObservers();
    initializeSmoothScroll();
    // initializeMobileMenu(); // УДАЛЕНО: Мобильное меню удалено
    initializeFormHandler();
    initializeHeaderAnimation();
    initializeModalHandlers();
    initializeHeroAnimation();
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