/**
 * СКРИПТ ЗАГРУЗКИ ТЕСТОВЫХ ДАННЫХ (SEED)
 * 
 * Запускается командой: npm run db:seed
 * Загружает начальные данные для тестирования приложения
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createConnection, initializeDatabase } = require('../config/database');

console.log('🌱 Iniciando carga de datos de prueba...\n');

// Сначала инициализируем БД (создаем таблицы если их нет)
initializeDatabase();

// Даем время на завершение инициализации
setTimeout(() => {
    console.log('📥 Cargando datos de prueba...');
    
    const db = createConnection();
    
    // Читаем SQL файл с тестовыми данными
    const seedsPath = path.join(__dirname, 'seeds.sql');
    const seedsSQL = fs.readFileSync(seedsPath, 'utf8');
    
    // Выполняем SQL команды для вставки данных
    db.exec(seedsSQL, (err) => {
        if (err) {
            console.error('❌ Error al cargar datos:', err.message);
            db.close();
            process.exit(1);
        }
        
        console.log('✅ Datos de prueba cargados correctamente\n');
        console.log('👥 Usuarios creados:');
        console.log('   Admin: admin@manoseguras.com / admin123');
        console.log('   Cliente 1: juan.perez@email.com / cliente123');
        console.log('   Cliente 2: maria.gonzalez@email.com / cliente123');
        console.log('   Profesional 1: carlos.elec@email.com / prof123');
        console.log('   Profesional 2: roberto.plomero@email.com / prof123');
        console.log('   Profesional 3: diego.gasista@email.com / prof123');
        console.log('\n✅ Base de datos lista para usar!');
        
        db.close();
    });
}, 1000);
