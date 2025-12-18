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

// POST /profile/password - Actualizar contraseña
router.post('/password', requireAuth, profileController.changePassword);

// POST /profile/availability - Guardar calendario
router.post('/availability', requireAuth, profileController.updateAvailability);

// POST /profile/certificaciones - Agregar certificación
router.post('/certificaciones', requireAuth, profileController.addCertificacion);

// POST /profile/certificaciones/:id/delete - Eliminar certificación
router.post('/certificaciones/:id/delete', requireAuth, profileController.deleteCertificacion);

// POST /profile/servicios - Agregar servicio
router.post('/servicios', requireAuth, profileController.addService);

// POST /profile/servicios/:id/delete - Eliminar servicio
router.post('/servicios/:id/delete', requireAuth, profileController.deleteService);

module.exports = router;
