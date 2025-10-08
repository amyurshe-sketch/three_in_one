// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

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
    
    // Сохраняем выбор в localStorage
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Переключение языка
const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
    const isEnglish = document.body.lang === 'en';
    
    if (isEnglish) {
        document.body.lang = 'ru';
    } else {
        document.body.lang = 'en';
    }
    
    // Сохраняем выбор в localStorage
    localStorage.setItem('language', isEnglish ? 'ru' : 'en');
});

// Восстановление настроек при загрузке
window.addEventListener('DOMContentLoaded', () => {
    // Восстановление темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        themeIcon.className = 'fas fa-sun';
    }

    // Восстановление языка
    const savedLang = localStorage.getItem('language') || 'ru';
    document.body.lang = savedLang;
});

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

// Обработка формы обратной связи
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    // Валидация
    if (!data.name || !data.email || !data.message) {
        showMessage(
            document.body.lang === 'ru' 
                ? 'Пожалуйста, заполните все поля' 
                : 'Please fill in all fields', 
            'error'
        );
        return;
    }

    // Проверка email или телефона
    if (!isValidEmailOrPhone(data.email)) {
        showMessage(
            document.body.lang === 'ru'
                ? 'Пожалуйста, введите корректный email или номер телефона'
                : 'Please enter a valid email or phone number (digits only, at least 5 characters)',
            'error'
        );
        // Сообщение появится под формой, как и остальные сообщения
        return;
    }

    // Показываем состояние загрузки
    const originalText = submitBtn.textContent;
    submitBtn.textContent = document.body.lang === 'ru' ? 'Отправка...' : 'Sending...';
    submitBtn.disabled = true;

    try {
        // Отправка данных в Telegram
        const response = await sendToTelegram(data);
        
        if (response.ok) {
            showMessage(
                document.body.lang === 'ru' 
                    ? 'Сообщение успешно отправлено!' 
                    : 'Message sent successfully!', 
                'success'
            );
            contactForm.reset();
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showMessage(
            document.body.lang === 'ru'
                ? 'Ошибка отправки сообщения. Попробуйте еще раз.'
                : 'Error sending message. Please try again.',
            'error'
        );
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Функция отправки в Telegram
async function sendToTelegram(data) {
    const message = `
📧 Новое сообщение с сайта

👤 Имя: ${data.name}
📧 Email/Телефон: ${data.email}
💬 Сообщение: ${data.message}

📅 ${new Date().toLocaleString('ru-RU')}
    `;

    try {
        // Используем ваш API endpoint
        const response = await fetch('/api/telegram.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                name: data.name,
                email: data.email
            })
        });

        return response;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        throw error;
    }
}

// Вспомогательные функции
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Функция проверки email или телефона
function isValidEmailOrPhone(value) {
    // Проверка на email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Проверка на телефон (только цифры, минимум 5 символов)
    const phoneRegex = /^[0-9]{5,}$/;
    
    return emailRegex.test(value) || phoneRegex.test(value);
}

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

// Анимация хедера при скролле
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'var(--glass)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Анимация хедера
    const header = document.querySelector('header');
    header.style.transition = 'all 0.3s ease';
    
    // Анимация появления главного заголовка
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 1s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
});
