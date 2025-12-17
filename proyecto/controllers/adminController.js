/**
 * КОНТРОЛЛЕР: ADMIN (Панель администратора)
 * 
 * Управление пользователями, профессионалами и reviews
 */

const User = require('../models/User');
const Professional = require('../models/Professional');
const Review = require('../models/Review');
const Solicitud = require('../models/Solicitud');

/**
 * Dashboard админа
 * GET /admin
 */
exports.dashboard = async (req, res) => {
    try {
        // Получаем статистику
        const totalUsers = await User.count();
        const totalProfessionals = await Professional.count();
        const pendingReviews = await Review.count('pendiente');
        const unverifiedProfs = await Professional.count({ verificado: 0 });

        // Получаем последних пользователей
        const recentUsers = await User.findAll(5, 0);

        // Получаем непроверенных профессионалов
        const pendingProfessionals = await Professional.findAll({
            verificado: 0,
            limit: 5,
            offset: 0
        });

        // Получаем reviews на модерацию
        const pendingReviewsList = await Review.findAll('pendiente', 5, 0);

        res.render('admin', {
            title: 'Panel de Administración',
            stats: {
                totalUsers,
                totalProfessionals,
                pendingReviews,
                unverifiedProfs
            },
            recentUsers,
            pendingProfessionals,
            pendingReviewsList,
            extraCSS: '<link rel="stylesheet" href="/css/admin.css">'
        });

    } catch (error) {
        console.error('Error en dashboard admin:', error);
        req.flash('error', 'Error al cargar el panel de administración');
        res.redirect('/');
    }
};

/**
 * Listar todos los usuarios
 * GET /admin/usuarios
 */
exports.listUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 30;
        const offset = (page - 1) * perPage;

        const users = await User.findAll(perPage, offset);
        const total = await User.count();
        const totalPages = Math.ceil(total / perPage);

        res.render('admin-users', {
            title: 'Gestión de Usuarios',
            users,
            currentPage: page,
            totalPages,
            extraCSS: '<link rel="stylesheet" href="/css/admin.css">'
        });

    } catch (error) {
        console.error('Error al listar usuarios:', error);
        req.flash('error', 'Error al cargar usuarios');
        res.redirect('/admin');
    }
};

/**
 * Eliminar usuario
 * POST /admin/usuarios/:id/delete
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // No permitir eliminar al propio admin
        if (userId === req.session.userId) {
            req.flash('error', 'No puedes eliminar tu propia cuenta');
            return res.redirect('/admin/usuarios');
        }

        await User.delete(userId);
        
        req.flash('success', 'Usuario eliminado correctamente');
        res.redirect('/admin/usuarios');

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        req.flash('error', 'Error al eliminar el usuario');
        res.redirect('/admin/usuarios');
    }
};

/**
 * Listar profesionales pendientes de verificación
 * GET /admin/profesionales
 */
exports.listProfessionals = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 20;
        const offset = (page - 1) * perPage;

        // Mostrar solo no verificados
        const professionals = await Professional.findAll({
            verificado: 0,
            limit: perPage,
            offset
        });

        const total = await Professional.count({ verificado: 0 });
        const totalPages = Math.ceil(total / perPage);

        res.render('admin-professionals', {
            title: 'Verificación de Profesionales',
            professionals,
            currentPage: page,
            totalPages,
            extraCSS: '<link rel="stylesheet" href="/css/admin.css">'
        });

    } catch (error) {
        console.error('Error al listar profesionales:', error);
        req.flash('error', 'Error al cargar profesionales');
        res.redirect('/admin');
    }
};

/**
 * Aprobar o rechazar profesional
 * POST /admin/profesionales/:id/verificar
 */
exports.verifyProfessional = async (req, res) => {
    try {
        const professionalId = parseInt(req.params.id);
        const { action } = req.body; // 'aprobar' o 'rechazar'

        if (action === 'aprobar') {
            await Professional.setVerificado(professionalId, true);
            req.flash('success', 'Profesional verificado correctamente');
        } else if (action === 'rechazar') {
            await Professional.setVerificado(professionalId, false);
            // TODO: Opcionalmente enviar email de rechazo
            req.flash('success', 'Profesional rechazado');
        }

        res.redirect('/admin/profesionales');

    } catch (error) {
        console.error('Error al verificar profesional:', error);
        req.flash('error', 'Error al procesar la verificación');
        res.redirect('/admin/profesionales');
    }
};

/**
 * Listar reviews pendientes de moderación
 * GET /admin/reviews
 */
exports.listReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const estado = req.query.estado || 'pendiente';
        const perPage = 20;
        const offset = (page - 1) * perPage;

        const reviews = await Review.findAll(estado, perPage, offset);
        const total = await Review.count(estado);
        const totalPages = Math.ceil(total / perPage);

        res.render('admin-reviews', {
            title: 'Moderación de Reviews',
            reviews,
            currentPage: page,
            totalPages,
            estado,
            extraCSS: '<link rel="stylesheet" href="/css/admin.css">'
        });

    } catch (error) {
        console.error('Error al listar reviews:', error);
        req.flash('error', 'Error al cargar reviews');
        res.redirect('/admin');
    }
};

/**
 * Aprobar o rechazar review
 * POST /admin/reviews/:id/moderar
 */
exports.moderateReview = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const { action } = req.body; // 'aprobar' o 'rechazar'

        if (action === 'aprobar') {
            await Review.updateEstado(reviewId, 'aprobada');
            
            // Actualizar rating del profesional
            const review = await Review.findById(reviewId);
            if (review) {
                await Professional.updateRating(review.profesional_id);
            }
            
            req.flash('success', 'Review aprobado');
        } else if (action === 'rechazar') {
            await Review.updateEstado(reviewId, 'rechazada');
            req.flash('success', 'Review rechazado');
        }

        res.redirect('/admin/reviews');

    } catch (error) {
        console.error('Error al moderar review:', error);
        req.flash('error', 'Error al moderar el review');
        res.redirect('/admin/reviews');
    }
};
