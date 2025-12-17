/**
 * КОНФИГУРАЦИЯ СЕССИЙ
 * 
 * Настройка express-session для хранения данных сессии
 * (информация о залогиненном пользователе)
 */

const session = require('express-session');

// Экспортируем middleware для использования в app.js
module.exports = session({
    // Секретный ключ для подписи cookie (берем из .env)
    secret: process.env.SESSION_SECRET || 'cambiar_esto_en_produccion',
    
    // Не пересохранять сессию если она не изменилась
    resave: false,
    
    // Не создавать сессию пока в ней нет данных
    saveUninitialized: false,
    
    // Настройки cookie
    cookie: {
        // Максимальный возраст cookie: 24 часа (в миллисекундах)
        maxAge: 1000 * 60 * 60 * 24,
        
        // Только по HTTP (не доступен из JavaScript для безопасности)
        httpOnly: true,
        
        // Только по HTTPS в production
        secure: process.env.NODE_ENV === 'production'
    }
});
