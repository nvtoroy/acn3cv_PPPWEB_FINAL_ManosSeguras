/**
 * РОУТЫ: АУТЕНТИФИКАЦИЯ
 * 
 * Маршруты для login, registro и logout
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireGuest } = require('../middleware/auth');
const { validateLogin, validateRegistration, handleValidationErrors } = require('../utils/validation');

// GET /login - Показать форму логина
router.get('/login', requireGuest, authController.showLogin);

// POST /login - Обработать логин
router.post('/login', 
    requireGuest, 
    validateLogin, 
    handleValidationErrors, 
    authController.login
);

// GET /registro - Показать форму регистрации
router.get('/registro', requireGuest, authController.showRegistro);

// POST /registro - Обработать регистрацию
router.post('/registro', 
    requireGuest, 
    validateRegistration, 
    handleValidationErrors, 
    authController.registro
);

// GET /logout - Cerrar sesión
router.get('/logout', authController.logout);

module.exports = router;
