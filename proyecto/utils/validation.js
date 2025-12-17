/**
 * УТИЛИТЫ: ВАЛИДАЦИЯ ФОРМ
 * 
 * Правила валидации для различных форм приложения
 * Использует express-validator
 */

const { body, validationResult } = require('express-validator');

/**
 * Правила валидации для регистрации пользователя
 */
const validateRegistration = [
    body('nombre')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres')
        .escape(),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Ingresa un correo electrónico válido')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    body('password_confirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden'),
    
    body('telefono')
        .optional()
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección es demasiado larga')
];

/**
 * Правила валидации для логина
 */
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Ingresa un correo electrónico válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

/**
 * Правила валидации для создания solicitud (заявки)
 */
const validateSolicitud = [
    body('tipo_servicio')
        .trim()
        .notEmpty()
        .withMessage('El tipo de servicio es obligatorio')
        .isLength({ min: 3, max: 100 })
        .withMessage('El tipo de servicio debe tener entre 3 y 100 caracteres')
        .escape(),
    
    body('descripcion')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ min: 10, max: 1000 })
        .withMessage('La descripción debe tener entre 10 y 1000 caracteres')
        .escape(),
    
    body('direccion')
        .trim()
        .notEmpty()
        .withMessage('La dirección es obligatoria')
        .isLength({ min: 5, max: 255 })
        .withMessage('La dirección debe tener entre 5 y 255 caracteres')
        .escape(),
    
    body('fecha_preferida')
        .optional()
        .isDate()
        .withMessage('La fecha debe ser válida'),
    
    body('horario')
        .optional()
        .isIn(['mañana', 'tarde', 'noche'])
        .withMessage('El horario debe ser mañana, tarde o noche'),
    
    body('presupuesto_estimado')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El presupuesto debe ser un número positivo')
];

/**
 * Правила валидации para review (отзыв)
 */
const validateReview = [
    body('calificacion')
        .isInt({ min: 1, max: 5 })
        .withMessage('La calificación debe ser entre 1 y 5 estrellas'),
    
    body('comentario')
        .trim()
        .notEmpty()
        .withMessage('El comentario es obligatorio')
        .isLength({ min: 10, max: 500 })
        .withMessage('El comentario debe tener entre 10 y 500 caracteres')
        .escape()
];

/**
 * Middleware для обработки ошибок валидации
 * Должен вызываться после правил валидации в route
 * 
 * Пример: router.post('/registro', validateRegistration, handleValidationErrors, controller.register)
 */
function handleValidationErrors(req, res, next) {
    // Получаем ошибки валидации
    const errors = validationResult(req);
    
    // Если есть ошибки
    if (!errors.isEmpty()) {
        // Берем первую ошибку
        const firstError = errors.array()[0];
        
        // Сохраняем сообщение об ошибке во flash
        req.flash('error', firstError.msg);
        
        // Возвращаем пользователя назад с сохраненными данными формы
        return res.redirect('back');
    }
    
    // Ошибок нет - продолжаем
    next();
}

module.exports = {
    validateRegistration,
    validateLogin,
    validateSolicitud,
    validateReview,
    handleValidationErrors
};
