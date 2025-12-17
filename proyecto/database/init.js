/**
 * СКРИПТ ИНИЦИАЛИЗАЦИИ БАЗЫ ДАННЫХ
 * 
 * Запускается командой: npm run db:init
 * Создает структуру таблиц в базе данных
 */

require('dotenv').config();
const { initializeDatabase } = require('../config/database');

console.log('🚀 Iniciando proceso de inicialización de la base de datos...\n');

// Запускаем инициализацию
initializeDatabase();

console.log('\n✅ Proceso completado. La base de datos está lista para usar.');
console.log('💡 Ahora puedes cargar datos de prueba con: npm run db:seed');
