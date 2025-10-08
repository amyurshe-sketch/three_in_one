// api/telegram.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message, language } = req.body;

        // Ваши данные бота
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            throw new Error('Telegram credentials not configured');
        }

        // Форматируем сообщение
        const telegramMessage = `
📧 Новое сообщение с сайта three-in-one

👤 Имя: ${name}
📧 Контакты: ${email}
💬 Сообщение: ${message}
🌐 Язык: ${language === 'en' ? 'English' : 'Russian'}

📅 ${new Date().toLocaleString('ru-RU')}
        `.trim();

        // Отправляем в Telegram
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.status(200).json({ status: 'success' });
        } else {
            throw new Error(data.description || 'Telegram API error');
        }

    } catch (error) {
        console.error('Error sending to Telegram:', error);
        res.status(500).json({ 
            status: 'error', 
            error: error.message 
        });
    }
}
