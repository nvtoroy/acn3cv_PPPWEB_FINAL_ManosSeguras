/**
 * КОНТРОЛЛЕР: PROFILE (Личный кабинет)
 * 
 * Управление профилем пользователя
 */

const User = require('../models/User');
const Professional = require('../models/Professional');
const Solicitud = require('../models/Solicitud');
const Certificacion = require('../models/Certificacion');
const Availability = require('../models/Availability');
const Service = require('../models/Service');

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
        let services = [];
        const activeTab = req.query.tab || 'solicitudes';

        // Если профессионал - получаем доп. данные
        if (userRole === 'profesional') {
            professional = await Professional.findByUserId(userId);
            if (professional) {
                certificaciones = await Certificacion.findByProfessional(professional.id);
                availability = await Availability.findByProfessional(professional.id);
                services = await Service.findByProfessional(professional.id);
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
            services,
            activeTab,
            availability,
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
        const { nombre, apellido, telefono, direccion, experiencia, descripcion, especialidad, zona_cobertura, avatar_url } = req.body;

        // Actualizar datos básicos del usuario
        const nombreCompleto = [nombre, apellido].filter(Boolean).join(' ').trim() || nombre;

        await User.update(userId, {
            nombre: nombreCompleto,
            telefono,
            direccion,
            avatar: avatar_url || null
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
        const tab = req.body.tab || 'datos-personales';
        res.redirect(`/profile?tab=${tab}`);

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

/**
 * Guardar disponibilidad del profesional
 * POST /profile/availability
 */
exports.updateAvailability = async (req, res) => {
    try {
        if (req.session.userRole !== 'profesional') {
            req.flash('error', 'Solo los profesionales pueden editar su calendario');
            return res.redirect('/profile');
        }

        const professional = await Professional.findByUserId(req.session.userId);
        if (!professional) {
            req.flash('error', 'Perfil profesional no encontrado');
            return res.redirect('/profile');
        }

        const { slots } = req.body; // JSON string or object
        let parsed = [];
        if (typeof slots === 'string') {
            parsed = JSON.parse(slots);
        } else if (Array.isArray(slots)) {
            parsed = slots;
        }

        // Normalizamos y filtramos
        const normalized = parsed
            .filter(s => s.fecha && s.estado)
            .map(s => ({
                fecha: s.fecha,
                estado: s.estado
            }));

        await Availability.replaceAll(professional.id, normalized);

        req.flash('success', 'Disponibilidad actualizada');
        res.redirect('/profile?tab=calendario');
    } catch (error) {
        console.error('Error al actualizar disponibilidad:', error);
        req.flash('error', 'No se pudo guardar la disponibilidad');
        res.redirect('/profile?tab=calendario');
    }
};

/**
 * Crear certificación
 */
exports.addCertificacion = async (req, res) => {
    try {
        const professional = await Professional.findByUserId(req.session.userId);
        if (!professional) {
            req.flash('error', 'No se encontró el perfil profesional');
            return res.redirect('/profile?tab=certificaciones');
        }
        const { nombre, archivo } = req.body;
        if (!nombre) {
            req.flash('error', 'Nombre de certificación requerido');
            return res.redirect('/profile?tab=certificaciones');
        }
        await Certificacion.create({
            professional_id: professional.id,
            nombre,
            archivo: archivo || ''
        });
        req.flash('success', 'Certificación agregada');
        res.redirect('/profile?tab=certificaciones');
    } catch (error) {
        console.error('Error al agregar certificación:', error);
        req.flash('error', 'No se pudo agregar la certificación');
        res.redirect('/profile?tab=certificaciones');
    }
};

/**
 * Eliminar certificación
 */
exports.deleteCertificacion = async (req, res) => {
    try {
        const certId = parseInt(req.params.id);
        await Certificacion.delete(certId);
        req.flash('success', 'Certificación eliminada');
        res.redirect('/profile?tab=certificaciones');
    } catch (error) {
        console.error('Error al eliminar certificación:', error);
        req.flash('error', 'No se pudo eliminar la certificación');
        res.redirect('/profile?tab=certificaciones');
    }
};

/**
 * Crear servicio
 */
exports.addService = async (req, res) => {
    try {
        const professional = await Professional.findByUserId(req.session.userId);
        if (!professional) {
            req.flash('error', 'No se encontró el perfil profesional');
            return res.redirect('/profile?tab=servicios');
        }
        const { nombre, precio_desde, precio_hasta } = req.body;
        if (!nombre) {
            req.flash('error', 'Nombre de servicio requerido');
            return res.redirect('/profile?tab=servicios');
        }
        await Service.create({
            professional_id: professional.id,
            nombre,
            precio_desde: precio_desde || null,
            precio_hasta: precio_hasta || null
        });
        req.flash('success', 'Servicio agregado');
        res.redirect('/profile?tab=servicios');
    } catch (error) {
        console.error('Error al agregar servicio:', error);
        req.flash('error', 'No se pudo agregar el servicio');
        res.redirect('/profile?tab=servicios');
    }
};

/**
 * Eliminar servicio
 */
exports.deleteService = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        await Service.delete(serviceId);
        req.flash('success', 'Servicio eliminado');
        res.redirect('/profile?tab=servicios');
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        req.flash('error', 'No se pudo eliminar el servicio');
        res.redirect('/profile?tab=servicios');
    }
};
