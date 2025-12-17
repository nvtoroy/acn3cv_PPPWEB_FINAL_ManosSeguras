/**
 * КОНТРОЛЛЕР: HOME (Главная страница)
 * 
 * Обработка главной страницы сайта
 */

const Professional = require('../models/Professional');

/**
 * Показать главную страницу
 * GET /
 */
exports.index = async (req, res) => {
    try {
        // Получаем топ-3 профессионала для показа на главной
        const topProfessionals = await Professional.findAll({
            verificado: 1,
            limit: 3,
            offset: 0
        });

        res.render('index', {
            title: 'Inicio',
            professionals: topProfessionals
        });

    } catch (error) {
        console.error('Error al cargar página principal:', error);
        res.render('index', {
            title: 'Inicio',
            professionals: []
        });
    }
};
