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
            const icon = langToggle.querySelector('i');
            langToggle.innerHTML = this.currentLanguage === 'ru' ? 'EN <i class="fas fa-globe"></i>' : 'RU <i class="fas fa-globe"></i>';
        }

        // Show/hide language elements
        document.querySelectorAll('.lang-ru, .lang-en').forEach(el => {
            if (el.classList.contains('lang-ru')) {
                el.style.display = this.currentLanguage === 'ru' ? 'block' : 'none';
            }
            if (el.classList.contains('lang-en')) {
                el.style.display = this.currentLanguage === 'en' ? 'block' : 'none';
            }
        });
    }

    updateButtonTexts() {
        const submitBtns = document.querySelectorAll('#submitBtn');
        submitBtns.forEach(btn => {
            if (this.currentLanguage === 'ru') {
                btn.textContent = 'Отправить сообщение';
            } else {
                btn.textContent = 'Send Message';
            }
        });
    }

    applyLanguage(language) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[language] && translations[language][key]) {
                element.textContent = translations[language][key];
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

// Переключение темы и языка (сохраняем существующую логику)
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');
const langToggle = document.getElementById('langToggle');

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('theme-dark');
        
        if (isDark) {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            themeIcon.className = 'fas fa-sun';
        }
        
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// Восстановление настроек при загрузке
window.addEventListener('DOMContentLoaded', () => {
    // Восстановление темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }

    // Восстановление языка
    const savedLang = localStorage.getItem('language') || 'ru';
    document.body.lang = savedLang;
    app.currentLanguage = savedLang;
    app.updateLanguageDisplay();
});

// Обработка формы обратной связи
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('email'), // используем поле email как телефон
            service: 'Веб-разработка', // фиксированная услуга для этого сайта
            message: formData.get('message')
        };

        // Валидация
        if (!data.name || !data.phone || !data.message) {
            alert(app.getTranslation('form.required'));
            return;
        }

        // Показываем состояние загрузки
        const submitBtns = contactForm.querySelectorAll('button[type="submit"]');
        const originalTexts = [];
        submitBtns.forEach(btn => {
            originalTexts.push(btn.textContent);
            btn.textContent = app.getTranslation('form.sending');
            btn.disabled = true;
        });

        try {
            // Отправка данных в Telegram через Vercel API
            const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                // Показываем модальное окно успеха
                app.showModal();
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            alert(app.getTranslation('form.error'));
        } finally {
            // Восстанавливаем кнопки
            submitBtns.forEach((btn, index) => {
                btn.textContent = originalTexts[index];
                btn.disabled = false;
            });
        }
    });
}

// Остальной существующий код...
// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
        }
    });
}, observerOptions);

// Наблюдаем за всеми элементами с анимацией
document.querySelectorAll('.service-card, .portfolio-item, .skill-item, .contact-form, .contact-info').forEach(el => {
    observer.observe(el);
});

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});

// Анимация прогресс-баров при скролле
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 300);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
}

// Анимация хедера при скролле
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Анимация хедера
    const header = document.querySelector('header');
    if (header) {
        header.style.transition = 'all 0.3s ease';
    }
    
    // Анимация появления главного заголовка
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
});

// Escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        app.hideModal();
    }
});
// Simple modal close fix
document.addEventListener('click', function(e) {
    // Close when clicking X
    if (e.target.id === 'closeModal') {
        document.getElementById('successModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Close when clicking close button
    if (e.target.id === 'modalCloseBtn') {
        document.getElementById('successModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Close when clicking outside modal
    if (e.target.id === 'successModal') {
        document.getElementById('successModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});
