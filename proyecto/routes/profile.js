/**
 * РОУТЫ: PROFILE
 * 
 * Маршруты para личный кабинет пользователя
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');

// GET /profile - Ver perfil personal
router.get('/', requireAuth, profileController.show);

// POST /profile/update - Actualizar perfil
router.post('/update', requireAuth, profileController.update);

module.exports = router;
