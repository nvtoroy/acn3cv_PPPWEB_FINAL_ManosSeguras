/**
 * КОНТРОЛЛЕР: АУТЕНТИФИКАЦИЯ
 * 
 * Обработка регистрации, логина и выхода пользователей
 */

const bcrypt = require('bcrypt');
const User = require('../models/User');
const Professional = require('../models/Professional');
const Certificacion = require('../models/Certificacion');

/**
 * Показать страницу логина
 * GET /login
 */
exports.showLogin = (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión'
    });
};

/**
 * Обработать форму логина
 * POST /login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ищем пользователя по email
        const user = await User.findByEmail(email);

        if (!user) {
            req.flash('error', 'Correo o contraseña incorrectos');
            return res.redirect('/login');
        }

        // Проверяем пароль (сравниваем с хешем в БД)
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            req.flash('error', 'Correo o contraseña incorrectos');
            return res.redirect('/login');
        }

        // Сохраняем данные пользователя в сессии
        req.session.userId = user.id;
        req.session.userRole = user.rol;
        req.session.userName = user.nombre;
        req.session.userAvatar = user.avatar;

        // Перенаправляем в зависимости от роли
        if (user.rol === 'admin') {
            req.flash('success', `Bienvenido, ${user.nombre}`);
            return res.redirect('/admin');
        } else if (user.rol === 'profesional') {
            req.flash('success', `Bienvenido, ${user.nombre}`);
            return res.redirect('/profile');
        } else {
            req.flash('success', `Bienvenido, ${user.nombre}`);
            return res.redirect('/profesionales');
        }

    } catch (error) {
        console.error('Error en login:', error);
        req.flash('error', 'Error al iniciar sesión. Intenta nuevamente.');
        res.redirect('/login');
    }
};

/**
 * Mostrar página de registro
 * GET /registro
 */
exports.showRegistro = (req, res) => {
    res.render('registro', {
        title: 'Registro'
    });
};

/**
 * Procesar registro de nuevo usuario
 * POST /registro
 */
exports.registro = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password,
            telefono,
            direccion,
            rol,
            // Campos para profesionales
            especialidad,
            experiencia,
            descripcion,
            certificaciones
        } = req.body;

        // Verificar que el email no esté en uso
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            req.flash('error', 'El correo electrónico ya está registrado');
            return res.redirect('/registro');
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const userId = await User.create({
            nombre,
            email,
            password: hashedPassword,
            telefono,
            direccion,
            rol: rol || 'cliente'
        });

        // Si es profesional, crear también perfil profesional
        if (rol === 'profesional') {
            const professionalId = await Professional.create({
                user_id: userId,
                especialidad: especialidad || 'electricista',
                experiencia: experiencia || 0,
                descripcion: descripcion || '',
                zona_cobertura: req.body.zona_cobertura || null
            });
            
            // Guardar certificaciones si se enviaron
            if (certificaciones) {
                const listaCerts = certificaciones.split(',').map(c => c.trim()).filter(Boolean);
                for (const cert of listaCerts) {
                    await Certificacion.create({
                        professional_id: professionalId,
                        nombre: cert,
                        archivo: ''
                    });
                }
            }
        }

        req.flash('success', 'Registro exitoso! Ya puedes iniciar sesión.');
        res.redirect('/login');

    } catch (error) {
        console.error('Error en registro:', error);
        req.flash('error', 'Error al registrarse. Intenta nuevamente.');
        res.redirect('/registro');
    }
};

/**
 * Cerrar sesión
 * GET /logout
 */
exports.logout = (req, res) => {
    // Destruir sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
};
