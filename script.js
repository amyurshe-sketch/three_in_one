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

    getTranslation(key) {
        return translations[this.currentLanguage][key] || key;
    }
}

// Initialize app manager
const app = new AppManager();

// Form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('email'), // using email field as phone
            service: 'Веб-разработка', // fixed service for this site
            message: formData.get('message')
        };

        // Validation
        if (!data.name || !data.phone || !data.message) {
            alert(app.getTranslation('form.required'));
            return;
        }

        // Show loading state
        const submitBtns = contactForm.querySelectorAll('button[type="submit"]');
        const originalTexts = [];
        submitBtns.forEach(btn => {
            if (btn) {
                originalTexts.push(btn.textContent);
                btn.textContent = app.getTranslation('form.sending');
                btn.disabled = true;
            }
        });

        try {
            // Send data to Telegram via Vercel API
            const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                // Show success modal
                app.showModal();
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            alert(app.getTranslation('form.error'));
        } finally {
            // Restore buttons
            submitBtns.forEach((btn, index) => {
                if (btn) {
                    btn.textContent = originalTexts[index];
                    btn.disabled = false;
                }
            });
        }
    });
}

// Safe Intersection Observer initialization
function initializeObservers() {
    // Animation for scroll elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);

    // Observe all elements with animation - WITH SAFETY CHECKS
    const elementsToObserve = document.querySelectorAll('.service-card, .portfolio-item, .skill-item, .contact-form, .contact-info');
    elementsToObserve.forEach(el => {
        if (el && el.nodeType === 1) { // Check if it's an Element node
            observer.observe(el);
        }
    });

    // Skill bars animation - ИСПРАВЛЕННАЯ ВЕРСИЯ
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target) {
                    const width = entry.target.getAttribute('data-width') || '0%';
                    // Сбрасываем ширину для анимации
                    entry.target.style.width = '0%';
                    // Запускаем анимацию
                    setTimeout(() => {
                        entry.target.style.width = width;
                        // Устанавливаем CSS переменную для анимации
                        entry.target.style.setProperty('--progress-width', width);
                    }, 50);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => {
            if (bar && bar.nodeType === 1) {
                // Инициализируем начальное значение
                const width = bar.getAttribute('data-width') || '0%';
                bar.style.width = '0%';
                skillObserver.observe(bar);
            }
        });
    }
}

// Smooth scrolling for navigation
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

// Mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link) {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        navLinks.style.display = 'none';
                    }
                });
            }
        });
    }
}

// Header animation on scroll
function initializeHeaderAnimation() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'var(--glass)';
                header.style.backdropFilter = 'blur(15px)';
            } else {
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
            }
        }
    });
}

// Modal close handlers
function initializeModalHandlers() {
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            app.hideModal();
        }
    });

    // Click handlers for modal close
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('successModal');
        if (!modal) return;

        // Close when clicking X
        if (e.target.id === 'closeModal' || e.target.id === 'modalCloseBtn') {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Close when clicking outside modal
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
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
    // Initialize header transition
    const header = document.querySelector('header');
    if (header) {
        header.style.transition = 'all 0.3s ease';
    }
    
    // Initialize all components
    initializeObservers();
    initializeSmoothScroll();
    initializeMobileMenu();
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