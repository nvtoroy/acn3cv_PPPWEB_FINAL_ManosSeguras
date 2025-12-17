/**
 * КОНТРОЛЛЕР: PROFESIONALES (Профессионалы)
 * 
 * Список и просмотр профилей профессионалов
 */

const Professional = require('../models/Professional');
const Review = require('../models/Review');
const Certificacion = require('../models/Certificacion');

/**
 * Показать список профессионалов с фильтрами
 * GET /profesionales
 */
exports.list = async (req, res) => {
    try {
        // Получаем параметры из query string
        const page = parseInt(req.query.page) || 1;
        const especialidad = req.query.especialidad || null;
        const ubicacion = req.query.ubicacion || null;
        const calificacion = req.query.calificacion ? parseFloat(req.query.calificacion) : null;
        const verificadoParam = req.query.verificado || '';
        const verificado = verificadoParam === 'verificado' ? 1 : null;
        const perPage = 12;
        const offset = (page - 1) * perPage;

        // Получаем профессионалов (только verificados)
        const professionals = await Professional.findAll({
            especialidad,
            verificado,
            calificacionMin: calificacion,
            ubicacion,
            limit: perPage,
            offset
        });

        // Подсчитываем общее количество для пагинации
        const total = await Professional.count({ 
            especialidad, 
            verificado,
            calificacionMin: calificacion,
            ubicacion
        });
        const totalPages = Math.ceil(total / perPage);

        res.render('profesionales', {
            title: 'Profesionales',
            professionals,
            currentPage: page,
            totalPages,
            especialidad,
            ubicacion,
            calificacion,
            verificado: verificadoParam,
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
        const certificaciones = await Certificacion.findByProfessional(professionalId);

        res.render('perfil-public', {
            title: professional.nombre,
            professional,
            reviews,
            certificaciones,
            extraCSS: '<link rel="stylesheet" href="/css/perfil-public.css">'
        });

    } catch (error) {
        console.error('Error al cargar perfil:', error);
        req.flash('error', 'Error al cargar el perfil del profesional');
        res.redirect('/profesionales');
    }
};
