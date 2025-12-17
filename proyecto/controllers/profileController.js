/**
 * КОНТРОЛЛЕР: PROFILE (Личный кабинет)
 * 
 * Управление профилем пользователя
 */

const User = require('../models/User');
const Professional = require('../models/Professional');
const Solicitud = require('../models/Solicitud');

/**
 * Показать личный кабинет
 * GET /profile
 */
exports.show = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userRole = req.session.userRole;

        // Получаем данные пользователя
        const user = await User.findById(userId);

        if (!user) {
            req.flash('error', 'Usuario no encontrado');
            return res.redirect('/');
        }

        let professional = null;
        let solicitudes = [];

        // Если профессионал - получаем доп. данные
        if (userRole === 'profesional') {
            professional = await Professional.findByUserId(userId);
            
            // Получаем заявки профессионала
            solicitudes = await Solicitud.findAll({
                profesional_id: professional?.id,
                limit: 10,
                offset: 0
            });
        }

        // Если клиент - получаем его заявки
        if (userRole === 'cliente') {
            solicitudes = await Solicitud.findAll({
                cliente_id: userId,
                limit: 10,
                offset: 0
            });
        }

        res.render('miperfil', {
            title: 'Mi Perfil',
            user,
            professional,
            solicitudes,
            extraCSS: '<link rel="stylesheet" href="/css/miperfil.css">'
        });

    } catch (error) {
        console.error('Error al cargar perfil:', error);
        req.flash('error', 'Error al cargar tu perfil');
        res.redirect('/');
    }
};

/**
 * Actualizar perfil
 * POST /profile/update
 */
exports.update = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { nombre, telefono, direccion, experiencia, descripcion } = req.body;

        // Actualizar datos básicos del usuario
        await User.update(userId, {
            nombre,
            telefono,
            direccion,
            avatar: null  // TODO: implementar upload de avatar
        });

        // Si es profesional, actualizar también perfil profesional
        if (req.session.userRole === 'profesional') {
            const professional = await Professional.findByUserId(userId);
            if (professional) {
                await Professional.update(professional.id, {
                    especialidad: professional.especialidad,  // No cambiar especialidad
                    experiencia: experiencia || professional.experiencia,
                    descripcion: descripcion || professional.descripcion
                });
            }
        }

        // Actualizar nombre en sesión
        req.session.userName = nombre;

        req.flash('success', 'Perfil actualizado correctamente');
        res.redirect('/profile');

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        req.flash('error', 'Error al actualizar el perfil');
        res.redirect('/profile');
    }
};
