-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ (SEED) - ManosSeguras
-- ============================================
-- Начальные данные для тестирования приложения

-- ============================================
-- ПОЛЬЗОВАТЕЛИ
-- ============================================

-- Администратор
-- Email: admin@manoseguras.com
-- Пароль: admin123
INSERT INTO users (nombre, email, password, telefono, direccion, rol) VALUES
('Administrador del Sistema', 'admin@manoseguras.com', '$2b$10$.aQMuhoKJbTIdnHoCWUbJezTO1eJy/55amKG4SE/1ZaHbmEyD83C.', '+54 11 1111-1111', 'Oficina Central, Buenos Aires', 'admin');

-- Клиенты (2 пользователя)
-- Email: juan.perez@email.com, maria.gonzalez@email.com
-- Пароль для всех: cliente123
INSERT INTO users (nombre, email, password, telefono, direccion, rol) VALUES
('Juan Pérez', 'juan.perez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 2222-2222', 'Av. Corrientes 1234, CABA', 'cliente'),
('María González', 'maria.gonzalez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 3333-3333', 'Calle 50 n° 567, La Plata', 'cliente');

-- Профессионалы (3 пользователя)
-- Email: carlos.elec@email.com, roberto.plomero@email.com, diego.gasista@email.com
-- Пароль для всех: prof123
INSERT INTO users (nombre, email, password, telefono, direccion, rol) VALUES
('Carlos Electricista', 'carlos.elec@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 4444-4444', 'Belgrano, CABA', 'profesional'),
('Roberto Plomero', 'roberto.plomero@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 5555-5555', 'Palermo, CABA', 'profesional'),
('Diego Gasista', 'diego.gasista@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 6666-6666', 'Recoleta, CABA', 'profesional');

-- ============================================
-- ПРОФЕССИОНАЛЫ (расширенные профили)
-- ============================================

INSERT INTO professionals (user_id, especialidad, experiencia, descripcion, verificado, calificacion_promedio, trabajos_completados) VALUES
(4, 'electricista', 8, 'Electricista matriculado con 8 años de experiencia. Especializado en instalaciones, reparaciones y mantenimiento eléctrico residencial y comercial. Trabajo prolijo y con garantía.', 1, 4.50, 127),
(5, 'plomero', 12, 'Plomero profesional con amplia experiencia en instalaciones sanitarias, reparación de cañerías, destapes y mantenimiento. Atención las 24 horas para emergencias.', 1, 4.80, 245),
(6, 'gasista', 15, 'Gasista matriculado con 15 años de experiencia. Especializado en instalaciones de gas natural, conversión de artefactos, certificaciones y mantenimiento preventivo.', 1, 4.90, 189);

-- ============================================
-- CERTIFICACIONES
-- ============================================

INSERT INTO certificaciones (professional_id, nombre, archivo) VALUES
(1, 'Matrícula de Electricista Profesional', 'certificaciones/cert_electricista_carlos.pdf'),
(1, 'Curso de Seguridad Eléctrica', 'certificaciones/cert_seguridad_carlos.pdf'),
(2, 'Matrícula de Plomero Gasista', 'certificaciones/cert_plomero_roberto.pdf'),
(3, 'Matrícula de Gasista Matriculado', 'certificaciones/cert_gasista_diego.pdf'),
(3, 'Certificación en Instalación de Calderas', 'certificaciones/cert_calderas_diego.pdf');

-- ============================================
-- SOLICITUDES DE SERVICIOS
-- ============================================

-- Solicitud 1: Aceptada por Carlos (electricista)
INSERT INTO solicitudes (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, fecha_preferida, horario, presupuesto_estimado, estado) VALUES
(2, 1, 'Instalación eléctrica', 'Necesito instalar 4 tomas adicionales en la cocina y cambiar el tablero eléctrico principal por uno más moderno con térmica diferencial.', 'Av. Corrientes 1234, CABA', '2025-12-20', 'mañana', 35000.00, 'aceptada');

-- Solicitud 2: En progreso con Roberto (plomero)
INSERT INTO solicitudes (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, fecha_preferida, horario, presupuesto_estimado, estado) VALUES
(3, 2, 'Reparación de cañería', 'Hay una pérdida de agua importante en el baño. Se ve humedad en la pared y se escucha goteo. Es urgente.', 'Calle 50 n° 567, La Plata', '2025-12-18', 'tarde', 15000.00, 'en_progreso');

-- Solicitud 3: Pendiente (sin asignar profesional)
INSERT INTO solicitudes (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, fecha_preferida, horario, presupuesto_estimado, estado) VALUES
(2, NULL, 'Instalación de calefón', 'Quiero instalar un calefón a gas natural en el baño principal. El baño ya tiene salida de gas.', 'Av. Corrientes 1234, CABA', '2025-12-22', 'tarde', 45000.00, 'pendiente');

-- Solicitud 4: Pendiente (sin asignar)
INSERT INTO solicitudes (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, fecha_preferida, horario, presupuesto_estimado, estado) VALUES
(3, NULL, 'Reparación eléctrica', 'Se queman las luces de una habitación frecuentemente. Puede ser problema en el cableado o instalación.', 'Calle 50 n° 567, La Plata', '2025-12-19', 'mañana', 10000.00, 'pendiente');

-- Solicitud 5: Completada (ya finalizada)
INSERT INTO solicitudes (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, fecha_preferida, horario, presupuesto_estimado, estado) VALUES
(2, 1, 'Instalación de ventilador de techo', 'Instalación de ventilador de techo con luz en el living. Ya tengo comprado el ventilador.', 'Av. Corrientes 1234, CABA', '2025-12-10', 'tarde', 8000.00, 'completada');

-- ============================================
-- MENSAJES (chat en solicitudes)
-- ============================================

-- Mensajes de la solicitud 1
INSERT INTO mensajes (solicitud_id, autor_id, contenido) VALUES
(1, 2, 'Hola Carlos, ¿cuándo podrías venir a revisar el trabajo?'),
(1, 4, 'Hola Juan, puedo ir mañana por la mañana. ¿Te viene bien a las 10?'),
(1, 2, 'Perfecto, te espero a las 10. Muchas gracias!');

-- Mensajes de la solicitud 2
INSERT INTO mensajes (solicitud_id, autor_id, contenido) VALUES
(2, 3, 'La pérdida es importante, ¿pueden venir hoy?'),
(2, 5, 'Sí, paso en 2 horas. Ya llevo los materiales necesarios.'),
(2, 5, 'Ya llegué, estoy esperando abajo.'),
(2, 3, 'Bajo ahora mismo!');

-- ============================================
-- REVIEWS (отзывы clientes sobre profesionales)
-- ============================================

-- Review de Juan sobre Carlos (por solicitud completada 5)
INSERT INTO reviews (solicitud_id, cliente_id, profesional_id, calificacion, comentario, estado) VALUES
(5, 2, 1, 5, 'Excelente trabajo! Carlos fue muy profesional, prolijo y puntual. El ventilador quedó perfecto. Lo recomiendo 100%.', 'aprobada');

-- Review pendiente de moderación
INSERT INTO reviews (solicitud_id, cliente_id, profesional_id, calificacion, comentario, estado) VALUES
(2, 3, 2, 5, 'Roberto solucionó el problema de la pérdida muy rápido. Muy buen servicio y precio justo.', 'pendiente');
