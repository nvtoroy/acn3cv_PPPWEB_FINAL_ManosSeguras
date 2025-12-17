/**
 * РОУТЫ: ГЛАВНЫЙ ROUTER
 * 
 * Объединяет все роуты приложения
 */

const express = require('express');
const router = express.Router();

// Импортируем роуты модулей
const authRoutes = require('./auth');
const professionalRoutes = require('./professional');
const profileRoutes = require('./profile');
const solicitudRoutes = require('./solicitud');
const adminRoutes = require('./admin');

// Импортируем контроллер главной страницы
const homeController = require('../controllers/homeController');

// Главная страница
router.get('/', homeController.index);

// Монтируем роуты модулей
router.use('/', authRoutes);                        // /login, /registro, /logout
router.use('/profesionales', professionalRoutes);   // /profesionales, /profesionales/:id
router.use('/profile', profileRoutes);              // /profile, /profile/update
router.use('/solicitudes', solicitudRoutes);        // /solicitudes/*
router.use('/admin', adminRoutes);                  // /admin/*

module.exports = router;
