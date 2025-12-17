/**
 * РОУТЫ: ADMIN
 * 
 * Маршруты для панели администратора
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// Все роуты требуют роль admin
router.use(requireAuth, requireRole('admin'));

// GET /admin - Dashboard principal
router.get('/', adminController.dashboard);

// GET /admin/usuarios - Lista de usuarios
router.get('/usuarios', adminController.listUsers);

// POST /admin/usuarios/:id/delete - Eliminar usuario
router.post('/usuarios/:id/delete', adminController.deleteUser);

// GET /admin/profesionales - Lista de profesionales pendientes
router.get('/profesionales', adminController.listProfessionals);

// POST /admin/profesionales/:id/verificar - Verificar profesional
router.post('/profesionales/:id/verificar', adminController.verifyProfessional);

// GET /admin/reviews - Lista de reviews pendientes
router.get('/reviews', adminController.listReviews);

// POST /admin/reviews/:id/moderar - Moderar review
router.post('/reviews/:id/moderar', adminController.moderateReview);

module.exports = router;
