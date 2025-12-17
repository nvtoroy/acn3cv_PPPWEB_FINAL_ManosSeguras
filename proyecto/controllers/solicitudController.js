/**
 * КОНТРОЛЛЕР: SOLICITUDES (Заявки на услуги)
 * 
 * Создание и управление заявками
 */

const Solicitud = require('../models/Solicitud');
const Mensaje = require('../models/Mensaje');
const Review = require('../models/Review');
const Professional = require('../models/Professional');

/**
 * Mostrar formulario создания заявки
 * GET /solicitudes/crear
 */
exports.showCreate = (req, res) => {
    // Опционально получить ID профессионала если выбран
    const profesionalId = req.query.profesional || null;
    
    let professional = null;
    
    const renderForm = () => {
        res.render('solicitar', {
            title: 'Solicitar Servicio',
            profesionalId,
            professional,
            extraCSS: '<link rel="stylesheet" href="/css/solicitar.css">'
        });
    };
    
    if (profesionalId) {
        Professional.findById(profesionalId)
            .then((prof) => {
                professional = prof;
                renderForm();
            })
            .catch(() => renderForm());
    } else {
        renderForm();
    }
};

/**
 * Crear nueva solicitud
 * POST /solicitudes
 */
exports.create = async (req, res) => {
    try {
        const clienteId = req.session.userId;
        const {
            tipo_servicio,
            descripcion,
            direccion,
            ciudad,
            codigo_postal,
            fecha_preferida,
            horario,
            presupuesto_estimado,
            profesional_id
        } = req.body;

        // Validar profesional si viene seteado
        let profesionalIdClean = null;
        if (profesional_id) {
            const prof = await Professional.findById(parseInt(profesional_id));
            if (prof) {
                profesionalIdClean = prof.id;
            }
        }

        // Crear solicitud
        const solicitudId = await Solicitud.create({
            cliente_id: clienteId,
            tipo_servicio,
            descripcion,
            direccion,
            ciudad: ciudad || null,
            codigo_postal: codigo_postal || null,
            fecha_preferida: fecha_preferida || null,
            horario: horario || null,
            presupuesto_estimado: presupuesto_estimado || null,
            profesional_id: profesionalIdClean
        });

        req.flash('success', 'Solicitud creada correctamente. Los profesionales podrán verla y contactarte.');
        res.redirect(`/solicitudes/${solicitudId}`);

    } catch (error) {
        console.error('Error al crear solicitud:', error);
        req.flash('error', 'Error al crear la solicitud');
        res.redirect('/solicitudes/crear');
    }
};

/**
 * Ver detalle de solicitud (con chat)
 * GET /solicitudes/:id
 */
exports.show = async (req, res) => {
    try {
        const solicitudId = parseInt(req.params.id);
        const userId = req.session.userId;
        const userRole = req.session.userRole;

        // Obtener solicitud
        const solicitud = await Solicitud.findById(solicitudId);

        if (!solicitud) {
            req.flash('error', 'Solicitud no encontrada');
            return res.redirect('/profile');
        }

        // Verificar permisos (solo cliente, profesional asignado o admin)
        const isCliente = solicitud.cliente_id === userId;
        const isProfesional = solicitud.profesional_id && 
            (await Professional.findByUserId(userId))?.id === solicitud.profesional_id;
        const isAdmin = userRole === 'admin';

        if (!isCliente && !isProfesional && !isAdmin) {
            req.flash('error', 'No tienes permiso para ver esta solicitud');
            return res.redirect('/profile');
        }

        // Obtener mensajes
        const mensajes = await Mensaje.findBySolicitud(solicitudId);

        // Verificar si ya existe review
        const hasReview = await Review.existsForSolicitud(solicitudId);

        res.render('solicitud-detail', {
            title: `Solicitud #${solicitudId}`,
            solicitud,
            mensajes,
            hasReview,
            canReview: isCliente && solicitud.estado === 'completada' && !hasReview,
            extraCSS: '<link rel="stylesheet" href="/css/miperfil.css">'
        });

    } catch (error) {
        console.error('Error al cargar solicitud:', error);
        req.flash('error', 'Error al cargar la solicitud');
        res.redirect('/profile');
    }
};

/**
 * Enviar mensaje en solicitud
 * POST /solicitudes/:id/mensaje
 */
exports.sendMessage = async (req, res) => {
    try {
        const solicitudId = parseInt(req.params.id);
        const userId = req.session.userId;
        const { contenido } = req.body;

        if (!contenido || contenido.trim().length === 0) {
            req.flash('error', 'El mensaje no puede estar vacío');
            return res.redirect(`/solicitudes/${solicitudId}`);
        }

        // Validar acceso
        const solicitud = await Solicitud.findById(solicitudId);
        if (!solicitud) {
            req.flash('error', 'Solicitud no encontrada');
            return res.redirect('/profile');
        }
        const isCliente = solicitud.cliente_id === userId;
        const isProfesional = solicitud.profesional_id && (await Professional.findByUserId(userId))?.id === solicitud.profesional_id;
        const isAdmin = req.session.userRole === 'admin';

        if (!isCliente && !isProfesional && !isAdmin) {
            req.flash('error', 'No tienes permiso para enviar mensajes aquí');
            return res.redirect('/profile');
        }

        // Crear mensaje
        await Mensaje.create({
            solicitud_id: solicitudId,
            autor_id: userId,
            contenido: contenido.trim()
        });

        req.flash('success', 'Mensaje enviado');
        res.redirect(`/solicitudes/${solicitudId}`);

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        req.flash('error', 'Error al enviar el mensaje');
        res.redirect(`/solicitudes/${req.params.id}`);
    }
};

/**
 * Cambiar estado de solicitud (profesional)
 * POST /solicitudes/:id/estado
 */
exports.updateEstado = async (req, res) => {
    try {
        const solicitudId = parseInt(req.params.id);
        const { estado } = req.body;
        const userRole = req.session.userRole;

        // Obtener solicitud para validar
        const solicitud = await Solicitud.findById(solicitudId);
        if (!solicitud) {
            req.flash('error', 'Solicitud no encontrada');
            return res.redirect('/profile');
        }

        // Obtener datos del profesional si es profesional
        let professionalId = null;
        if (userRole === 'profesional') {
            const prof = await Professional.findByUserId(req.session.userId);
            professionalId = prof?.id;

            if (solicitud.profesional_id && solicitud.profesional_id !== professionalId) {
                req.flash('error', 'No puedes modificar esta solicitud');
                return res.redirect('/profile');
            }
        }

        // Actualizar estado
        await Solicitud.updateEstado(
            solicitudId,
            estado,
            estado === 'aceptada' ? professionalId : null
        );

        req.flash('success', 'Estado actualizado correctamente');
        res.redirect(`/solicitudes/${solicitudId}`);

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        req.flash('error', 'Error al actualizar el estado');
        res.redirect(`/solicitudes/${req.params.id}`);
    }
};

/**
 * Crear review para solicitud completada
 * POST /solicitudes/:id/review
 */
exports.createReview = async (req, res) => {
    try {
        const solicitudId = parseInt(req.params.id);
        const clienteId = req.session.userId;
        const { calificacion, comentario } = req.body;

        // Obtener solicitud
        const solicitud = await Solicitud.findById(solicitudId);

        if (!solicitud || solicitud.cliente_id !== clienteId) {
            req.flash('error', 'No puedes dejar un review para esta solicitud');
            return res.redirect(`/solicitudes/${solicitudId}`);
        }

        if (solicitud.estado !== 'completada') {
            req.flash('error', 'Solo puedes dejar reviews para trabajos completados');
            return res.redirect(`/solicitudes/${solicitudId}`);
        }

        // Verificar que no exista ya un review
        const hasReview = await Review.existsForSolicitud(solicitudId);
        if (hasReview) {
            req.flash('error', 'Ya dejaste un review para esta solicitud');
            return res.redirect(`/solicitudes/${solicitudId}`);
        }

        // Crear review
        await Review.create({
            solicitud_id: solicitudId,
            cliente_id: clienteId,
            profesional_id: solicitud.profesional_id,
            calificacion: parseInt(calificacion),
            comentario: comentario.trim()
        });

        req.flash('success', 'Review enviado. Será visible después de aprobación del administrador.');
        res.redirect(`/solicitudes/${solicitudId}`);

    } catch (error) {
        console.error('Error al crear review:', error);
        req.flash('error', 'Error al enviar el review');
        res.redirect(`/solicitudes/${req.params.id}`);
    }
};
