/**
 * MIDDLEWARE: ПРОВЕРКА РОЛЕЙ
 * 
 * Функции для ограничения доступа к страницам
 * на основе роли пользователя (admin, profesional, cliente)
 */

/**
 * Middleware: требует чтобы у пользователя была одна из указанных ролей
 * 
 * @param {...string} allowedRoles - разрешенные роли (admin, profesional, cliente)
 * @returns {Function} - middleware функция
 * 
 * Примеры использования:
 *   router.get('/admin', requireRole('admin'), controller.dashboard)
 *   router.get('/solicitudes', requireRole('profesional', 'admin'), controller.list)
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        // Получаем роль текущего пользователя из сессии
        const userRole = req.session.userRole;
        
        // Если роли нет в сессии - значит не залогинен
        if (!userRole) {
            req.flash('error', 'Debes iniciar sesión para acceder a esta página');
            return res.redirect('/login');
        }
        
        // Проверяем есть ли роль пользователя в списке разрешенных
        if (!allowedRoles.includes(userRole)) {
            // Нет доступа - показываем ошибку 403
            return res.status(403).render('error', {
                title: 'Acceso Denegado',
                message: 'No tienes permisos para acceder a esta página',
                error: {
                    status: 403,
                    stack: process.env.NODE_ENV === 'development' ? 
                        'Tu rol actual es: ' + userRole : ''
                }
            });
        }
        
        // Роль подходит - продолжаем
        next();
    };
}

/**
 * Middleware: проверяет что пользователь является владельцем ресурса
 * Используется для защиты редактирования профиля, заявок и т.д.
 * 
 * @param {string} paramName - название параметра с ID (по умолчанию 'id')
 * @returns {Function} - middleware функция
 * 
 * Пример: router.put('/profile/:id', requireOwnership(), controller.update)
 */
function requireOwnership(paramName = 'id') {
    return (req, res, next) => {
        const resourceId = parseInt(req.params[paramName]);
        const userId = req.session.userId;
        const userRole = req.session.userRole;
        
        // Админ имеет доступ ко всему
        if (userRole === 'admin') {
            return next();
        }
        
        // Обычный пользователь может редактировать только свои ресурсы
        if (resourceId !== userId) {
            req.flash('error', 'No tienes permiso para realizar esta acción');
            return res.redirect('/');
        }
        
        next();
    };
}

module.exports = {
    requireRole,
    requireOwnership
};
