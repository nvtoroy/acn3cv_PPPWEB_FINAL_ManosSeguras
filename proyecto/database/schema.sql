-- ============================================
-- СХЕМА БАЗЫ ДАННЫХ - ManosSeguras
-- ============================================
-- Таблицы для управления пользователями, профессионалами,
-- заявками на услуги, сообщениями и отзывами

-- Таблица пользователей (клиенты, профессионалы, админы)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- bcrypt hash
    telefono VARCHAR(20),
    direccion TEXT,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente',  -- 'cliente', 'profesional', 'admin'
    avatar VARCHAR(255),  -- путь к аватарке (opcional)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица профессионалов (расширенная информация для роли profesional)
CREATE TABLE IF NOT EXISTS professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,  -- FK к users
    especialidad VARCHAR(50) NOT NULL,  -- 'electricista', 'plomero', 'gasista'
    experiencia INTEGER DEFAULT 0,  -- лет опыта
    descripcion TEXT,
    foto_url VARCHAR(255),  -- путь к фото профиля (опционально)
    zona_cobertura TEXT,  -- área donde trabaja
    verificado BOOLEAN DEFAULT 0,  -- проверен ли админом
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    trabajos_completados INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица сертификатов профессионалов
CREATE TABLE IF NOT EXISTS certificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,  -- название сертификата
    archivo VARCHAR(255) NOT NULL,  -- путь к файлу
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
);

-- Таблица заявок на услуги
CREATE TABLE IF NOT EXISTS solicitudes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,  -- кто создал заявку
    profesional_id INTEGER,  -- кто принял (может быть NULL если еще не принята)
    tipo_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    direccion TEXT NOT NULL,
    ciudad TEXT,  -- ciudad declarada
    codigo_postal TEXT,
    fecha_preferida DATE,
    horario VARCHAR(50),  -- 'mañana', 'tarde', 'noche'
    presupuesto_estimado DECIMAL(10,2),
    estado VARCHAR(50) DEFAULT 'pendiente',  -- 'pendiente', 'aceptada', 'en_progreso', 'completada', 'rechazada', 'cancelada'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (profesional_id) REFERENCES professionals(id) ON DELETE SET NULL
);

-- Таблица сообщений (чат внутри заявки между клиентом и профессионалом)
CREATE TABLE IF NOT EXISTS mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solicitud_id INTEGER NOT NULL,
    autor_id INTEGER NOT NULL,  -- кто написал (может быть клиент или профессионал)
    contenido TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица отзывов (клиент оставляет отзыв после завершения заявки)
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solicitud_id INTEGER UNIQUE NOT NULL,  -- одна заявка = один отзыв
    cliente_id INTEGER NOT NULL,
    profesional_id INTEGER NOT NULL,
    calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),  -- 1-5 звезд
    comentario TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente',  -- 'pendiente', 'aprobada', 'rechazada' (модерация админом)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (profesional_id) REFERENCES professionals(id) ON DELETE CASCADE
);

-- ============================================
-- ИНДЕКСЫ для оптимизации поиска
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_especialidad ON professionals(especialidad);
CREATE INDEX IF NOT EXISTS idx_solicitudes_cliente_id ON solicitudes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_profesional_id ON solicitudes(profesional_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_reviews_estado ON reviews(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_solicitud ON mensajes(solicitud_id);

-- Disponibilidad pública de profesionales (calendario simple)
CREATE TABLE IF NOT EXISTS professional_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) NOT NULL, -- 'free', 'busy', 'mixed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(professional_id, fecha),
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_availability_prof ON professional_availability(professional_id);

-- Servicios ofrecidos por profesionales
CREATE TABLE IF NOT EXISTS professional_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    precio_desde DECIMAL(10,2),
    precio_hasta DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_services_prof ON professional_services(professional_id);
