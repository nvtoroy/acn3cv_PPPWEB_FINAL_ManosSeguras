/**
 * КОНФИГУРАЦИЯ БАЗЫ ДАННЫХ
 * 
 * Модуль для работы с SQLite базой данных.
 * Предоставляет функции для подключения и инициализации.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Получаем путь к БД из переменной окружения или используем путь по умолчанию
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database/database.sqlite');

/**
 * Создать подключение к базе данных
 * @returns {sqlite3.Database} - объект подключения к БД
 */
function createConnection() {
    // Создаем соединение с БД (файл создается автоматически если не существует)
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('❌ Error al conectar con la base de datos:', err.message);
            throw err;
        }
        console.log('✅ Conectado a la base de datos SQLite');
    });
    
    return db;
}

/**
 * Инициализировать базу данных (создать таблицы из schema.sql)
 */
function initializeDatabase() {
    console.log('📦 Inicializando base de datos...');
    
    const db = createConnection();
    
    // Читаем SQL схему из файла
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Выполняем SQL команды для создания таблиц
    db.exec(schema, (err) => {
        if (err) {
            console.error('❌ Error al crear las tablas:', err.message);
            db.close();
            throw err;
        }
        console.log('✅ Tablas creadas correctamente');
        db.close();
    });
}

module.exports = {
    createConnection,
    initializeDatabase,
    DB_PATH
};
