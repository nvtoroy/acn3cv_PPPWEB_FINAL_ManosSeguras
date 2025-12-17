# 🤖 Инструкции для LLM-агента разработчика

## 📋 Контекст проекта

Это **студенческий проект** для курса "Producción Web" (веб-разработка).

**Проект:** ManosSeguras - платформа для поиска и заказа услуг профессионалов (электриков, сантехников, газовщиков).

**Текущее состояние:** Готовы статичные HTML/CSS макеты (TP2), нужно реализовать полнофункциональное веб-приложение (FINAL).

---

## 🎯 Задание преподавателя

**Основной файл с заданием:** [consigna/Tarea FINAL (ESP-RU).md](consigna/Tarea%20FINAL%20(ESP-RU).md)

### Требования к реализации:

1. **CRUD** - полное управление данными (создание, чтение, обновление, удаление)
2. **Аутентификация** - Login/Logout пользователей
3. **3+ ролей пользователей:**
   - Клиент (cliente)
   - Профессионал (profesional)
   - Администратор (admin)
4. **Ограничения доступа** - защита страниц по ролям
5. **Валидация и санитизация** всех входных данных
6. **Пагинация** списков записей
7. **Паттерн MVC** (Model-View-Controller)

---

## 🛠️ Выбранный стек технологий

| Компонент            | Технология                  |
|----------------------|-----------------------------|
| **Runtime**          | Node.js 18+                 |
| **Web Framework**    | Express.js                  |
| **Database**         | SQLite3 (файловая БД)       |
| **Template Engine**  | EJS                         |
| **Session**          | express-session             |
| **Password Hashing** | bcrypt                      |
| **Архитектура**      | MVC (Model-View-Controller) |

**Почему этот стек:**
- Node.js - современный, легко читаемый код
- SQLite - простая БД в одном файле (не нужен отдельный сервер)
- Express - минималистичный фреймворк (нет "магии")
- EJS - простые шаблоны (почти обычный HTML)
- Студент сможет разобраться за 2-3 часа перед защитой

---

## 📂 Существующие файлы проекта

### HTML/CSS макеты (готовые):
- [proyecto/html/index.html](proyecto/html/index.html) - главная страница
- [proyecto/html/login.html](proyecto/html/login.html) - вход
- [proyecto/html/registro.html](proyecto/html/registro.html) - регистрация (клиент/профессионал)
- [proyecto/html/profesionales.html](proyecto/html/profesionales.html) - список профессионалов
- [proyecto/html/perfil-public.html](proyecto/html/perfil-public.html) - публичный профиль
- [proyecto/html/miperfil.html](proyecto/html/miperfil.html) - личный кабинет профессионала
- [proyecto/html/solicitar.html](proyecto/html/solicitar.html) - создание заявки
- [proyecto/html/admin.html](proyecto/html/admin.html) - админ-панель

### CSS стили (готовые):
- [proyecto/css/style.css](proyecto/css/style.css) - основные стили
- [proyecto/css/admin.css](proyecto/css/admin.css)
- [proyecto/css/miperfil.css](proyecto/css/miperfil.css)
- [proyecto/css/perfil-public.css](proyecto/css/perfil-public.css)
- [proyecto/css/profesionales.css](proyecto/css/profesionales.css)
- [proyecto/css/solicitar.css](proyecto/css/solicitar.css)

**Задача:** Конвертировать эти HTML файлы в EJS шаблоны и добавить серверную логику.

---

## 🏗️ Целевая структура проекта

Создай следующую структуру в папке `proyecto/`:

```
proyecto/
├── app.js                      # Главный файл приложения (точка входа)
├── package.json                # Зависимости Node.js
├── .gitignore                  # Игнорируемые файлы для Git
│
├── config/
│   ├── database.js             # Подключение к SQLite
│   └── session.js              # Конфигурация сессий
│
├── middleware/
│   ├── auth.js                 # Проверка аутентификации
│   └── roles.js                # Проверка прав доступа по ролям
│
├── models/
│   ├── User.js                 # Модель пользователя
│   ├── Professional.js         # Модель профессионала
│   ├── Solicitud.js            # Модель заявки
│   ├── Mensaje.js              # Модель сообщений
│   └── Review.js               # Модель отзывов
│
├── controllers/
│   ├── authController.js       # Логин/регистрация/выход
│   ├── homeController.js       # Главная страница
│   ├── professionalController.js  # Список и профили профессионалов
│   ├── profileController.js    # Личный кабинет
│   ├── solicitudController.js  # Создание и управление заявками
│   └── adminController.js      # Админ-панель
│
├── routes/
│   ├── index.js                # Главный роутер (собирает все маршруты)
│   ├── auth.js                 # Маршруты аутентификации
│   ├── professional.js         # Маршруты профессионалов
│   ├── profile.js              # Маршруты личного кабинета
│   ├── solicitud.js            # Маршруты заявок
│   └── admin.js                # Маршруты админки
│
├── views/
│   ├── layouts/
│   │   └── main.ejs            # Общий шаблон (header/footer)
│   ├── partials/
│   │   ├── header.ejs          # Шапка сайта
│   │   └── footer.ejs          # Подвал сайта
│   ├── index.ejs               # Главная
│   ├── login.ejs               # Логин
│   ├── registro.ejs            # Регистрация
│   ├── profesionales.ejs       # Список профессионалов
│   ├── perfil-public.ejs       # Публичный профиль
│   ├── miperfil.ejs            # Личный кабинет
│   ├── solicitar.ejs           # Форма заявки
│   └── admin.ejs               # Админ-панель
│
├── public/                     # Статичные файлы (CSS, JS, изображения)
│   ├── css/                    # (перенести из текущей папки proyecto/css/)
│   ├── js/                     # JavaScript для фронтенда
│   └── img/                    # (перенести из текущей папки proyecto/img/)
│
├── database/
│   ├── schema.sql              # SQL схема для создания таблиц
│   ├── seeds.sql               # Тестовые данные
│   └── database.sqlite         # Файл БД (создается автоматически)
│
└── utils/
    ├── validation.js           # Функции валидации
    └── helpers.js              # Вспомогательные функции
```

---

## 🗄️ Схема базы данных

Создай следующие таблицы:

### users (пользователи)
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
nombre VARCHAR(100)
email VARCHAR(100) UNIQUE
password VARCHAR(255)  -- bcrypt hash
telefono VARCHAR(20)
direccion TEXT
rol VARCHAR(20)  -- 'cliente', 'profesional', 'admin'
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### professionals (профессионалы)
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
user_id INTEGER UNIQUE  -- FK к users
especialidad VARCHAR(50)  -- 'electricista', 'plomero', 'gasista'
experiencia INTEGER  -- лет опыта
descripcion TEXT
verificado BOOLEAN DEFAULT 0
calificacion_promedio DECIMAL(3,2) DEFAULT 0
trabajos_completados INTEGER DEFAULT 0
FOREIGN KEY (user_id) REFERENCES users(id)
```

### certificaciones (сертификаты)
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
professional_id INTEGER
nombre VARCHAR(100)
archivo VARCHAR(255)  -- путь к файлу
FOREIGN KEY (professional_id) REFERENCES professionals(id)
```

### solicitudes (заявки)
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
cliente_id INTEGER
profesional_id INTEGER
tipo_servicio VARCHAR(100)
descripcion TEXT
direccion TEXT
fecha_preferida DATE
horario VARCHAR(50)
presupuesto_estimado DECIMAL(10,2)
estado VARCHAR(50)  -- 'pendiente', 'aceptada', 'en_progreso', 'completada', 'rechazada'
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (cliente_id) REFERENCES users(id)
FOREIGN KEY (profesional_id) REFERENCES professionals(id)
```

### mensajes (чат внутри заявки)
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
solicitud_id INTEGER
autor_id INTEGER
contenido TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id)
FOREIGN KEY (autor_id) REFERENCES users(id)
```

### reviews (отзывы)
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
solicitud_id INTEGER UNIQUE
calificacion INTEGER  -- 1-5 звезд
comentario TEXT
estado VARCHAR(20)  -- 'pendiente', 'aprobada', 'rechazada'
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id)
```

---

## 📝 Требования к коду

### 1. Комментарии (критически важно!)
**Студент будет разбираться перед защитой** - каждый файл должен быть снабжен **детальными комментариями на русском языке**.

**Пример хорошего комментирования:**

```javascript
/**
 * КОНТРОЛЛЕР АУТЕНТИФИКАЦИИ
 * 
 * Отвечает за регистрацию, вход и выход пользователей.
 * Используется bcrypt для шифрования паролей.
 */

const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * Показать страницу логина
 * GET /login
 */
exports.showLogin = (req, res) => {
    // Если пользователь уже залогинен - перенаправляем в профиль
    if (req.session.userId) {
        return res.redirect('/profile');
    }
    
    // Показываем форму логина
    res.render('login', { 
        error: null  // Ошибки пока нет
    });
};

/**
 * Обработка формы логина
 * POST /login
 */
exports.login = async (req, res) => {
    try {
        // Получаем данные из формы
        const { email, password } = req.body;
        
        // Валидация: проверяем что поля заполнены
        if (!email || !password) {
            return res.render('login', { 
                error: 'Заполните все поля' 
            });
        }
        
        // Ищем пользователя в базе данных
        const user = await User.findByEmail(email);
        
        // Если пользователь не найден
        if (!user) {
            return res.render('login', { 
                error: 'Неверный email или пароль' 
            });
        }
        
        // Проверяем пароль (сравниваем хеш)
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.render('login', { 
                error: 'Неверный email или пароль' 
            });
        }
        
        // Сохраняем ID пользователя в сессии (теперь он залогинен)
        req.session.userId = user.id;
        req.session.userRole = user.rol;
        
        // Перенаправляем в зависимости от роли
        if (user.rol === 'admin') {
            res.redirect('/admin');
        } else if (user.rol === 'profesional') {
            res.redirect('/profile');
        } else {
            res.redirect('/profesionales');
        }
        
    } catch (error) {
        console.error('Ошибка при логине:', error);
        res.render('login', { 
            error: 'Произошла ошибка, попробуйте позже' 
        });
    }
};
```

### 2. Размер файлов
- Каждый файл: **50-150 строк** (не считая комментариев)
- Если файл становится значительно больше - продумать и реализовать логику разделения (+пояснить действия в чат)

### 3. Именование
- Файлы: `camelCase.js` (например `authController.js`)
- Функции: `camelCase` (например `showLogin`)
- Переменные: `camelCase`
- Константы: `UPPER_SNAKE_CASE`

### 4. Безопасность
- ✅ Использовать prepared statements для SQL
- ✅ Хешировать пароли через bcrypt (rounds: 10)
- ✅ Валидировать ВСЕ входные данные
- ✅ Санитизировать HTML (защита от XSS)
- ✅ Проверять роли в middleware

---

## 🎨 Конвертация HTML в EJS

### Общий layout (views/layouts/main.ejs):
```ejs
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %> - ManosSeguras</title>
    <link rel="stylesheet" href="/css/style.css">
    <%- extraCSS || '' %>
</head>
<body>
    <%- include('../partials/header') %>
    
    <main>
        <%- body %>
    </main>
    
    <%- include('../partials/footer') %>
    
    <%- extraJS || '' %>
</body>
</html>
```

### Пример конвертации страницы:
Из `html/login.html` → в `views/login.ejs`:
```ejs
<%- include('layouts/main', { 
    title: 'Iniciar Sesión',
    body: `
        <div class="auth-wrapper">
            <section class="auth-card">
                <div class="auth-header">
                    <p class="eyebrow">Acceso</p>
                    <h1>Iniciar sesión</h1>
                </div>
                
                <% if (error) { %>
                    <div class="alert alert-error"><%= error %></div>
                <% } %>
                
                <form method="POST" action="/login" class="auth-form">
                    <div class="input-group">
                        <label for="email">Correo electrónico</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="input-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Iniciar sesión</button>
                </form>
            </section>
        </div>
    `
}) %>
```

---

## 🔐 Middleware для защиты роутов

### auth.js (проверка логина):
```javascript
/**
 * Middleware: проверяет что пользователь залогинен
 */
module.exports.requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};
```

### roles.js (проверка роли):
```javascript
/**
 * Middleware: проверяет что у пользователя нужная роль
 */
module.exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.session.userRole)) {
            return res.status(403).send('Доступ запрещен');
        }
        next();
    };
};
```

### Пример использования:
```javascript
const { requireAuth, requireRole } = require('./middleware/auth');

// Только для залогиненных
router.get('/profile', requireAuth, profileController.show);

// Только для админов
router.get('/admin', requireAuth, requireRole('admin'), adminController.dashboard);

// Для профессионалов и админов
router.get('/solicitudes', requireAuth, requireRole('profesional', 'admin'), ...);
```

---

## 📊 Пагинация

Реализовать пагинацию для:
- Список профессионалов (по 12 на странице)
- Список заявок (по 20 на странице)
- Админ-панель: пользователи (по 30 на странице)

**Пример:**
```javascript
/**
 * Получить профессионалов с пагинацией
 */
exports.list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Текущая страница
    const perPage = 12;  // Профессионалов на странице
    const offset = (page - 1) * perPage;
    
    // Получаем профессионалов с LIMIT и OFFSET
    const professionals = await Professional.findAll({ 
        limit: perPage, 
        offset: offset 
    });
    
    // Считаем общее количество
    const total = await Professional.count();
    const totalPages = Math.ceil(total / perPage);
    
    res.render('profesionales', {
        professionals,
        currentPage: page,
        totalPages
    });
};
```

---

## 📖 README.md (финальная документация)

**ВАЖНО:** Файл `README.md` в корне проекта - это **финальная документация** для сдачи профессору.

### Что туда включить:

1. **Название проекта:** ManosSeguras - Plataforma de Profesionales
2. **Описание:** краткое описание проекта и его цели
3. **Функциональности:**
   - Регистрация клиентов и профессионалов
   - Логин/выход
   - Поиск и просмотр профессионалов
   - Создание заявок на услуги
   - Чат между клиентом и профессионалом
   - Админ-панель для управления
4. **Роли пользователей и их права:**
   - **Клиент:** регистрация, поиск профессионалов, создание заявок, чат
   - **Профессионал:** регистрация, управление профилем, просмотр заявок, чат
   - **Администратор:** одобрение профессионалов, модерация отзывов, управление пользователями
5. **Скриншоты:** снимки экрана основных страниц
6. **Технологии:** Node.js, Express, SQLite, EJS, bcrypt

**Формат:** Markdown с заголовками, списками, таблицами и изображениями.

---

## ✅ Чек-лист перед завершением

Убедись что реализовано:

- [ ] **CRUD:** создание, чтение, обновление, удаление данных
- [ ] **Login/Logout:** вход и выход пользователей
- [ ] **3 роли:** cliente, profesional, admin
- [ ] **Защита роутов:** middleware проверяет права доступа
- [ ] **Валидация:** все формы проверяют входные данные
- [ ] **Санитизация:** защита от XSS и SQL-инъекций
- [ ] **Пагинация:** списки разбиты на страницы
- [ ] **MVC:** четкое разделение на модели, виды, контроллеры
- [ ] **Комментарии:** каждый файл подробно прокомментирован на русском
- [ ] **README.md:** финальная документация заполнена
- [ ] **Тестовые данные:** в БД есть примеры пользователей, заявок, отзывов
- [ ] **package.json:** все зависимости указаны

---

## Полезная информация

- По возможности не изобретать велосипед - использовать проверенные библиотеки и подходы.
- использовать доступные MCP-серверы по необходимости
- обязательно изучать документацию используемых технологий через mcp: context7
