/**
 * РОУТЫ: PROFESIONALES
 * 
 * Маршруты для lista y visualización de profesionales
 */

const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');

// GET /profesionales - Lista de profesionales
router.get('/', professionalController.list);

// GET /profesionales/:id - Perfil público de un profesional
router.get('/:id', professionalController.show);

module.exports = router;
