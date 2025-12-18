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
        const activeTab = req.query.tab || 'pendientes';

        // Stats
        const totalUsers = await User.count();
        const totalProfessionals = await Professional.count();
        const pendingReviews = await Review.count('pendiente');
        const unverifiedProfs = await Professional.count({ verificado: 0 });

        // Paginación en cada panel
        const usersPage = parseInt(req.query.users_page) || 1;
        const perPageUsers = 15;
        const usersOffset = (usersPage - 1) * perPageUsers;
        const roleFilter = req.query.rol || '';
        const users = await User.findAll(perPageUsers, usersOffset, roleFilter);
        const totalUsersFiltered = await User.count(roleFilter ? { rol: roleFilter } : {});
        const totalUsersPages = Math.ceil(totalUsersFiltered / perPageUsers);

        const pendingPage = parseInt(req.query.prof_page) || 1;
        const perPagePending = 10;
        const pendingOffset = (pendingPage - 1) * perPagePending;
        const pendingProfessionals = await Professional.findAll({
            verificado: 0,
            limit: perPagePending,
            offset: pendingOffset
        });
        const totalPending = await Professional.count({ verificado: 0 });
        const totalPendingPages = Math.ceil(totalPending / perPagePending);

        const reviewsEstado = req.query.estado || 'pendiente';
        const reviewsPage = parseInt(req.query.rev_page) || 1;
        const perPageReviews = 10;
        const reviewsOffset = (reviewsPage - 1) * perPageReviews;
        const pendingReviewsList = await Review.findAll(reviewsEstado, perPageReviews, reviewsOffset);
        const totalReviews = await Review.count(reviewsEstado);
        const totalReviewsPages = Math.ceil(totalReviews / perPageReviews);

        res.render('admin', {
            title: 'Panel de Administración',
            stats: {
                totalUsers,
                totalProfessionals,
                pendingReviews,
                unverifiedProfs
            },
            recentUsers: users,
            pendingProfessionals,
            pendingReviewsList,
            users,
            activeTab,
            currentUsersPage: usersPage,
            totalUsersPages,
            currentPendingPage: pendingPage,
            totalPendingPages,
            currentReviewsPage: reviewsPage,
            totalReviewsPages,
            reviewsEstado,
            roleFilter,
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
            const back = req.get('referer') || '/admin?tab=usuarios';
            return res.redirect(back.includes('/admin') ? back : '/admin?tab=usuarios');
        }

        await User.delete(userId);
        
        req.flash('success', 'Usuario eliminado correctamente');
        const back = req.get('referer') || '/admin?tab=usuarios';
        res.redirect(back.includes('/admin') ? back : '/admin?tab=usuarios');

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        req.flash('error', 'Error al eliminar el usuario');
        const back = req.get('referer') || '/admin?tab=usuarios';
        res.redirect(back.includes('/admin') ? back : '/admin?tab=usuarios');
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
            await Professional.setVerificado(professionalId, -1); // marcado como rechazado, sale de pendientes
            req.flash('success', 'Profesional rechazado');
        }

        const back = req.get('referer') || '/admin/profesionales';
        res.redirect(back.includes('/admin') ? back : '/admin/profesionales');

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

        const back = req.get('referer') || '/admin/reviews';
        res.redirect(back.includes('/admin') ? back : '/admin/reviews');

    } catch (error) {
        console.error('Error al moderar review:', error);
        req.flash('error', 'Error al moderar el review');
        res.redirect('/admin/reviews');
    }
};
