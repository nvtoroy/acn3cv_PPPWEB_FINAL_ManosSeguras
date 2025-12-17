/**
 * РОУТЫ: SOLICITUDES
 * 
 * Маршруты для создания y управления заявками
 */

const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validateSolicitud, handleValidationErrors } = require('../utils/validation');

// GET /solicitudes/crear - Форма создания solicitud (solo clientes)
router.get('/crear', 
    requireAuth, 
    requireRole('cliente'), 
    solicitudController.showCreate
);

// POST /solicitudes - Crear nueva solicitud (solo clientes)
router.post('/', 
    requireAuth, 
    requireRole('cliente'),
    validateSolicitud,
    handleValidationErrors,
    solicitudController.create
);

// GET /solicitudes/:id - Ver detalle de solicitud
router.get('/:id', requireAuth, solicitudController.show);

// POST /solicitudes/:id/mensaje - Enviar mensaje en chat
router.post('/:id/mensaje', requireAuth, solicitudController.sendMessage);

// POST /solicitudes/:id/estado - Cambiar estado (profesionales)
router.post('/:id/estado', 
    requireAuth, 
    requireRole('profesional', 'admin'),
    solicitudController.updateEstado
);

// POST /solicitudes/:id/review - Dejar review (solo clientes)
router.post('/:id/review', 
    requireAuth, 
    requireRole('cliente'),
    solicitudController.createReview
);

module.exports = router;
