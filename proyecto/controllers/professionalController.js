/**
 * КОНТРОЛЛЕР: PROFESIONALES (Профессионалы)
 * 
 * Список и просмотр профилей профессионалов
 */

const Professional = require('../models/Professional');
const Review = require('../models/Review');

/**
 * Показать список профессионалов с фильтрами
 * GET /profesionales
 */
exports.list = async (req, res) => {
    try {
        // Получаем параметры из query string
        const page = parseInt(req.query.page) || 1;
        const especialidad = req.query.especialidad || null;
        const perPage = 12;
        const offset = (page - 1) * perPage;

        // Получаем профессионалов (только verificados)
        const professionals = await Professional.findAll({
            especialidad,
            verificado: 1,
            limit: perPage,
            offset
        });

        // Подсчитываем общее количество для пагинации
        const total = await Professional.count({ 
            especialidad, 
            verificado: 1 
        });
        const totalPages = Math.ceil(total / perPage);

        res.render('profesionales', {
            title: 'Profesionales',
            professionals,
            currentPage: page,
            totalPages,
            especialidad,
            extraCSS: '<link rel="stylesheet" href="/css/profesionales.css">'
        });

    } catch (error) {
        console.error('Error al cargar profesionales:', error);
        req.flash('error', 'Error al cargar la lista de profesionales');
        res.redirect('/');
    }
};

/**
 * Mostrar perfil público de un profesional
 * GET /profesionales/:id
 */
exports.show = async (req, res) => {
    try {
        const professionalId = parseInt(req.params.id);

        // Obtener datos del profesional
        const professional = await Professional.findById(professionalId);

        if (!professional) {
            req.flash('error', 'Profesional no encontrado');
            return res.redirect('/profesionales');
        }

        // Obtener reviews aprobadas
        const reviews = await Review.findByProfessional(professionalId, true);

        res.render('perfil-public', {
            title: professional.nombre,
            professional,
            reviews,
            extraCSS: '<link rel="stylesheet" href="/css/perfil-public.css">'
        });

    } catch (error) {
        console.error('Error al cargar perfil:', error);
        req.flash('error', 'Error al cargar el perfil del profesional');
        res.redirect('/profesionales');
    }
};
