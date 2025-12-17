/**
 * APLICACIÓN PRINCIPAL - ManosSeguras
 * 
 * Servidor Express.js para plataforma de profesionales
 * Точка входа приложения
 */

require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const morgan = require('morgan');
const flash = require('connect-flash');

// Импортируем конфигурацию
const sessionConfig = require('./config/session');
const { initializeDatabase } = require('./config/database');
const { userLocals } = require('./middleware/auth');

// Импортируем вспомогательные функции для шаблонов
const helpers = require('./utils/helpers');

// Инициализируем Express
const app = express();
const PORT = process.env.PORT || 3000;

// Инициализируем базу данных (создаем таблицы если нужно)
console.log('🗄️  Inicializando base de datos...');
initializeDatabase();

// ============================================
// CONFIGURACIÓN DE VISTAS (EJS)
// ============================================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Hacer helpers disponibles en todas las vistas
app.locals = Object.assign(app.locals, helpers);

// ============================================
// MIDDLEWARE
// ============================================

// Logger de peticiones HTTP (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

// Parsear JSON (para APIs si es necesario)
app.use(express.json());

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones (login/logout)
app.use(sessionConfig);

// Flash messages (mensajes de éxito/error)
app.use(flash());

// Middleware para hacer datos de usuario disponibles en vistas
app.use(userLocals);

// Middleware para hacer flash messages disponibles en vistas
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error'),
        info: req.flash('info'),
        warning: req.flash('warning')
    };
    next();
});

// ============================================
// RUTAS
// ============================================

const routes = require('./routes');
app.use('/', routes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// 404 - Página no encontrada
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página no encontrada',
        message: 'La página que buscas no existe',
        error: { status: 404 }
    });
});

// Error general
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message || 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n💡 Usuarios de prueba:`);
    console.log(`   Admin: admin@manoseguras.com / admin123`);
    console.log(`   Cliente: juan.perez@email.com / cliente123`);
    console.log(`   Profesional: carlos.elec@email.com / prof123`);
    console.log(`\n🛠️  Para cargar datos de prueba: npm run db:seed\n`);
});
