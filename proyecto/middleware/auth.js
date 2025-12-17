/**
 * MIDDLEWARE: АУТЕНТИФИКАЦИЯ
 * 
 * Функции для проверки что пользователь залогинен
 * и для передачи информации о пользователе в шаблоны
 */

/**
 * Middleware: требует чтобы пользователь был залогинен
 * Если не залогинен - перенаправляет на страницу логина
 * 
 * Использование: router.get('/profile', requireAuth, controller.show)
 */
function requireAuth(req, res, next) {
    // Проверяем есть ли userId в сессии
    if (!req.session.userId) {
        // Сохраняем URL куда пользователь хотел попасть
        req.session.returnTo = req.originalUrl;
        
        // Показываем сообщение и перенаправляем на логин
        req.flash('error', 'Debes iniciar sesión para acceder a esta página');
        return res.redirect('/login');
    }
    
    // Пользователь залогинен - продолжаем
    next();
}

/**
 * Middleware: требует чтобы пользователь НЕ был залогинен
 * Используется для страниц login/registro чтобы залогиненные
 * пользователи не попадали туда
 * 
 * Использование: router.get('/login', requireGuest, controller.show)
 */
function requireGuest(req, res, next) {
    // Если пользователь залогинен - перенаправляем в профиль
    if (req.session.userId) {
        return res.redirect('/profile');
    }
    
    // Пользователь не залогинен - продолжаем
    next();
}

/**
 * Middleware: делает информацию о текущем пользователе доступной
 * во всех шаблонах EJS через переменную currentUser
 * 
 * Использование: app.use(userLocals) в app.js
 */
function userLocals(req, res, next) {
    // Передаем данные пользователя из сессии в locals (доступно в EJS)
    res.locals.currentUser = {
        id: req.session.userId || null,
        rol: req.session.userRole || null,
        nombre: req.session.userName || null,
        avatar: req.session.userAvatar || null,
        isAuthenticated: !!req.session.userId  // true если залогинен
    };
    
    next();
}

module.exports = {
    requireAuth,
    requireGuest,
    userLocals
};
