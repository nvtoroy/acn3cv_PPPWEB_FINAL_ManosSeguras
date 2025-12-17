/**
 * КОНТРОЛЛЕР: PROFILE (Личный кабинет)
 * 
 * Управление профилем пользователя
 */

const User = require('../models/User');
const Professional = require('../models/Professional');
const Solicitud = require('../models/Solicitud');
const Certificacion = require('../models/Certificacion');

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
        let certificaciones = [];

        // Если профессионал - получаем доп. данные
        if (userRole === 'profesional') {
            professional = await Professional.findByUserId(userId);
            if (professional) {
                certificaciones = await Certificacion.findByProfessional(professional.id);
            }
            
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
            certificaciones,
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
        const { nombre, apellido, telefono, direccion, experiencia, descripcion, especialidad, zona_cobertura } = req.body;

        // Actualizar datos básicos del usuario
        const nombreCompleto = [nombre, apellido].filter(Boolean).join(' ').trim() || nombre;

        await User.update(userId, {
            nombre: nombreCompleto,
            telefono,
            direccion,
            avatar: null  // TODO: implementar upload de avatar
        });

        // Si es profesional, actualizar también perfil profesional
        if (req.session.userRole === 'profesional') {
            const professional = await Professional.findByUserId(userId);
            if (professional) {
                await Professional.update(professional.id, {
                    especialidad: especialidad || professional.especialidad,
                    experiencia: experiencia || professional.experiencia,
                    descripcion: descripcion || professional.descripcion,
                    zona_cobertura: zona_cobertura || professional.zona_cobertura,
                    foto_url: professional.foto_url
                });
            }
        }

        // Actualizar nombre en sesión
        req.session.userName = nombreCompleto;

        req.flash('success', 'Perfil actualizado correctamente');
        res.redirect('/profile');

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        req.flash('error', 'Error al actualizar el perfil');
        res.redirect('/profile');
    }
};

/**
 * Actualizar contraseña del usuario
 * POST /profile/password
 */
exports.changePassword = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { current_password, new_password, confirm_password } = req.body;

        if (!current_password || !new_password || !confirm_password) {
            req.flash('error', 'Completa todos los campos de seguridad');
            return res.redirect('/profile');
        }

        if (new_password !== confirm_password) {
            req.flash('error', 'Las contraseñas nuevas no coinciden');
            return res.redirect('/profile');
        }

        const user = await User.findByIdWithPassword(userId);
        if (!user) {
            req.flash('error', 'Usuario no encontrado');
            return res.redirect('/profile');
        }

        const passwordOk = await require('bcrypt').compare(current_password, user.password);
        if (!passwordOk) {
            req.flash('error', 'La contraseña actual es incorrecta');
            return res.redirect('/profile');
        }

        const hashed = await require('bcrypt').hash(new_password, 10);
        await User.updatePassword(userId, hashed);

        req.flash('success', 'Contraseña actualizada correctamente');
        res.redirect('/profile');
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        req.flash('error', 'No se pudo actualizar la contraseña');
        res.redirect('/profile');
    }
};
