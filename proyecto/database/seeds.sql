-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ (SEED) - ManosSeguras
-- ============================================

-- Пароли (bcrypt):
-- admin: admin123  -> $2b$10$.aQMuhoKJbTIdnHoCWUbJezTO1eJy/55amKG4SE/1ZaHbmEyD83C.
-- clientes: cliente123 -> $2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq
-- profesionales: prof123 -> $2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q

-- ============================================
-- USUARIOS
-- ============================================

INSERT INTO users (nombre, email, password, telefono, direccion, rol) VALUES
-- Admin
('Administrador del Sistema', 'admin@manoseguras.com', '$2b$10$.aQMuhoKJbTIdnHoCWUbJezTO1eJy/55amKG4SE/1ZaHbmEyD83C.', '+54 11 0000-0000', 'Oficina Central, Buenos Aires', 'admin'),

-- 15 clientes (id 2-16)
('Juan Pérez', 'juan.perez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 2222-2222', 'Av. Corrientes 1234, CABA', 'cliente'),
('María González', 'maria.gonzalez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 3333-3333', 'Calle 50 n° 567, La Plata', 'cliente'),
('Pedro Ramírez', 'pedro.ramirez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 4444-2222', 'Lanús, Buenos Aires', 'cliente'),
('Ana Martínez', 'ana.martinez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 5555-2222', 'Quilmes, Buenos Aires', 'cliente'),
('Luis Fernández', 'luis.fernandez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 6666-2222', 'San Isidro, Buenos Aires', 'cliente'),
('Sofía Torres', 'sofia.torres@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 7777-2222', 'Belgrano, CABA', 'cliente'),
('Carlos López', 'carlos.lopez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 8888-2222', 'Palermo, CABA', 'cliente'),
('Lucía Álvarez', 'lucia.alvarez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 9999-2222', 'Recoleta, CABA', 'cliente'),
('Diego Gutiérrez', 'diego.gutierrez@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1212-2222', 'Vicente López, Buenos Aires', 'cliente'),
('Valentina Ríos', 'valentina.rios@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1313-2222', 'Caballito, CABA', 'cliente'),
('Martín Castro', 'martin.castro@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1414-2222', 'Flores, CABA', 'cliente'),
('Camila Vega', 'camila.vega@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1515-2222', 'Almagro, CABA', 'cliente'),
('Tomás Herrera', 'tomas.herrera@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1616-2222', 'Morón, Buenos Aires', 'cliente'),
('Paula Ortiz', 'paula.ortiz@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1717-2222', 'Berazategui, Buenos Aires', 'cliente'),
('Federico Díaz', 'federico.diaz@email.com', '$2b$10$qMSBmEEKnuWyshIuzdT/WOte.vWjAYuCyBtanflomIsAraeJksBWq', '+54 11 1818-2222', 'San Martín, Buenos Aires', 'cliente'),

-- 25 profesionales (id 17-41)
('Carlos Mendoza', 'carlos.mendoza@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 4444-4444', 'Belgrano, CABA', 'profesional'),
('Roberto Sánchez', 'roberto.sanchez@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 5555-5555', 'Palermo, CABA', 'profesional'),
('Diego Morales', 'diego.morales@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 6666-6666', 'Recoleta, CABA', 'profesional'),
('Laura Pereyra', 'laura.pereyra@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 6767-4444', 'Colegiales, CABA', 'profesional'),
('Nicolás Acosta', 'nicolas.acosta@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 6868-5555', 'Caballito, CABA', 'profesional'),
('Sofía Romero', 'sofia.romero@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 6969-6666', 'Villa Urquiza, CABA', 'profesional'),
('Marcelo Ibáñez', 'marcelo.ibanez@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7070-4444', 'Boedo, CABA', 'profesional'),
('Javier Aguirre', 'javier.aguirre@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7171-5555', 'Parque Patricios, CABA', 'profesional'),
('Esteban Vargas', 'esteban.vargas@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7272-6666', 'Almagro, CABA', 'profesional'),
('Rodrigo Navarro', 'rodrigo.navarro@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7373-4444', 'Villa Crespo, CABA', 'profesional'),
('Mariana Campos', 'mariana.campos@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7474-5555', 'Chacarita, CABA', 'profesional'),
('Julieta Medina', 'julieta.medina@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7575-6666', 'Villa Devoto, CABA', 'profesional'),
('Andrés Domínguez', 'andres.dominguez@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7676-4444', 'San Telmo, CABA', 'profesional'),
('Pablo Figueroa', 'pablo.figueroa@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7777-5555', 'Barracas, CABA', 'profesional'),
('Gabriela Ruiz', 'gabriela.ruiz@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7878-6666', 'Pompeya, CABA', 'profesional'),
('Hernán Giménez', 'hernan.gimenez@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 7979-4444', 'Villa Lugano, CABA', 'profesional'),
('Carla Soria', 'carla.soria@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8080-5555', 'Mataderos, CABA', 'profesional'),
('Facundo Ledesma', 'facundo.ledesma@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8181-6666', 'Liniers, CABA', 'profesional'),
('Florencia Benítez', 'florencia.benitez@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8282-4444', 'Ramos Mejía, Buenos Aires', 'profesional'),
('Bruno Pacheco', 'bruno.pacheco@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8383-5555', 'Ituzaingó, Buenos Aires', 'profesional'),
('Daniela Villalba', 'daniela.villalba@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8484-6666', 'Castelar, Buenos Aires', 'profesional'),
('Ignacio Molina', 'ignacio.molina@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8585-4444', 'Haedo, Buenos Aires', 'profesional'),
('Micaela Rojas', 'micaela.rojas@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8686-5555', 'Morón, Buenos Aires', 'profesional'),
('Sebastián Paredes', 'sebastian.paredes@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8787-6666', 'Avellaneda, Buenos Aires', 'profesional'),
('Eugenia Suárez', 'eugenia.suarez@email.com', '$2b$10$.img109dE2uBzR3JA1Isp.juQniEUAhwqC5mDioMe6emk1oQrPO0q', '+54 11 8888-4444', 'San Justo, Buenos Aires', 'profesional');

-- ============================================
-- PROFESIONALES (tabla professionals)
-- id 1..25 corresponden a user_id 17..41
-- ============================================

INSERT INTO professionals (user_id, especialidad, experiencia, descripcion, foto_url, zona_cobertura, verificado, calificacion_promedio, trabajos_completados) VALUES
(17, 'electricista', 8, 'Electricista matriculado. Instalaciones, reparaciones y mantenimiento eléctrico.', '/img/usuarios/nicolas.jpg', 'CABA norte y centro', 1, 4.5, 127),
(18, 'plomero', 12, 'Plomero profesional 24/7. Destapes, pérdidas y refacciones.', '/img/usuarios/sofia.jpg', 'CABA y zona norte', 1, 4.8, 245),
(19, 'gasista', 15, 'Gasista matriculado. Calefactores, certificaciones y mantenimiento.', '/img/usuarios/carlos.jpg', 'CABA y GBA norte', 1, 4.9, 189),
(20, 'electricista', 6, 'Montaje de tableros, iluminación y emergencias.', '/img/usuarios/placeholder.jpg', 'Colegiales y alrededores', 1, 4.3, 85),
(21, 'plomero', 5, 'Instalaciones sanitarias y cocina. Presupuestos claros.', '/img/usuarios/placeholder.jpg', 'Caballito y Flores', 1, 4.2, 63),
(22, 'gasista', 7, 'Conversión a gas natural y mantenimiento preventivo.', '/img/usuarios/placeholder.jpg', 'Villa Urquiza y Saavedra', 1, 4.4, 71),
(23, 'electricista', 10, 'Obra nueva, reformas y corrección de fallas.', '/img/usuarios/placeholder.jpg', 'Boedo y San Cristóbal', 1, 4.6, 140),
(24, 'plomero', 9, 'Cañerías, bombas y destapes. Atención rápida.', '/img/usuarios/placeholder.jpg', 'Parque Patricios y Constitución', 0, 0, 0),
(25, 'gasista', 11, 'Instalaciones de gas y revisión de fugas.', '/img/usuarios/placeholder.jpg', 'Almagro y Balvanera', 0, 0, 0),
(26, 'electricista', 4, 'Instalaciones domiciliarias y comerciales básicas.', '/img/usuarios/placeholder.jpg', 'Villa Crespo y Chacarita', 1, 4.1, 54),
(27, 'plomero', 6, 'Reparaciones rápidas y mantenimiento preventivo.', '/img/usuarios/placeholder.jpg', 'Chacarita y Palermo', 1, 4.0, 60),
(28, 'gasista', 8, 'Calderas, calefones y certificaciones.', '/img/usuarios/placeholder.jpg', 'Villa Devoto y Villa Pueyrredón', 1, 4.3, 88),
(29, 'electricista', 7, 'Cableado, puesta a tierra y tableros.', '/img/usuarios/placeholder.jpg', 'San Telmo y Montserrat', 0, 0, 0),
(30, 'plomero', 10, 'Gas y agua. Remodelaciones integrales.', '/img/usuarios/placeholder.jpg', 'Barracas y La Boca', 0, 0, 0),
(31, 'gasista', 12, 'Instalaciones industriales y domiciliarias.', '/img/usuarios/placeholder.jpg', 'Pompeya y Lugano', 0, 0, 0),
(32, 'electricista', 9, 'Cableado estructurado y domótica básica.', '/img/usuarios/placeholder.jpg', 'Villa Lugano y Liniers', 1, 4.2, 90),
(33, 'plomero', 5, 'Plomería fina y terminaciones.', '/img/usuarios/placeholder.jpg', 'Mataderos y Liniers', 1, 4.1, 58),
(34, 'gasista', 9, 'Instalación de estufas y calefones.', '/img/usuarios/placeholder.jpg', 'Liniers y Ciudadela', 0, 0, 0),
(35, 'electricista', 11, 'Proyectos grandes y certificaciones.', '/img/usuarios/placeholder.jpg', 'Ramos Mejía y Haedo', 1, 4.7, 150),
(36, 'plomero', 13, 'Obras y reparaciones de baño/cocina.', '/img/usuarios/placeholder.jpg', 'Ituzaingó y Castelar', 1, 4.6, 160),
(37, 'gasista', 10, 'Mantenimiento de gas y seguridad.', '/img/usuarios/placeholder.jpg', 'Castelar y Morón', 1, 4.5, 120),
(38, 'electricista', 5, 'Urgencias eléctricas 24/7.', '/img/usuarios/placeholder.jpg', 'Haedo y Ramos Mejía', 0, 0, 0),
(39, 'plomero', 4, 'Destapes y pérdidas menores.', '/img/usuarios/placeholder.jpg', 'Morón y Haedo', 0, 0, 0),
(40, 'gasista', 6, 'Ajustes y chequeo de instalaciones.', '/img/usuarios/placeholder.jpg', 'Avellaneda y Wilde', 0, 0, 0),
(41, 'electricista', 7, 'Mantenimiento preventivo y mejoras.', '/img/usuarios/placeholder.jpg', 'San Justo y Lomas', 0, 0, 0);

-- ============================================
-- CERTIFICACIONES (для первых профи)
-- ============================================
INSERT INTO certificaciones (professional_id, nombre, archivo) VALUES
(1, 'Matrícula Electricista Profesional', 'certificaciones/cert_electricista_carlos_mendoza.pdf'),
(1, 'Curso Seguridad Eléctrica', 'certificaciones/cert_seguridad_carlos_mendoza.pdf'),
(2, 'Matrícula Plomero', 'certificaciones/cert_plomero_roberto_sanchez.pdf'),
(3, 'Matrícula Gasista', 'certificaciones/cert_gasista_diego_morales.pdf'),
(4, 'Habilitación tableros trifásicos', 'certificaciones/cert_tableros_laura_pereyra.pdf'),
(5, 'Curso soldadura plástica', 'certificaciones/cert_soldadura_nicolas_acosta.pdf'),
(6, 'Certificación gasista de 1ra', 'certificaciones/cert_gasista_sofia_romero.pdf'),
(7, 'Matrícula Electricista A2', 'certificaciones/cert_electricista_marcelo_ibanez.pdf'),
(8, 'Curso bombas de agua', 'certificaciones/cert_bombas_javier_aguirre.pdf'),
(9, 'Certificado instalación de gas', 'certificaciones/cert_gas_esteban_vargas.pdf'),
(10, 'Curso domótica básica', 'certificaciones/cert_domotica_rodrigo_navarro.pdf');

-- ============================================
-- DISPONIBILIDAD (calendario público) para algunos profesionales
-- ============================================
INSERT INTO professional_availability (professional_id, fecha, estado) VALUES
(1, '2025-12-19', 'free'),
(1, '2025-12-20', 'busy'),
(1, '2025-12-21', 'mixed'),
(2, '2025-12-18', 'busy'),
(2, '2025-12-22', 'free'),
(3, '2025-12-23', 'free'),
(3, '2025-12-24', 'busy'),
(4, '2025-12-19', 'mixed'),
(4, '2025-12-20', 'free'),
(5, '2025-12-25', 'busy'),
(6, '2025-12-24', 'mixed'),
(7, '2025-12-26', 'free'),
(8, '2025-12-27', 'busy'),
(9, '2025-12-28', 'free'),
(10, '2025-12-29', 'mixed');

-- ============================================
-- SOLICITUDES
-- estados variados, con y sin profesional asignado
-- ============================================
INSERT INTO solicitudes (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, ciudad, codigo_postal, fecha_preferida, horario, presupuesto_estimado, estado) VALUES
(2, 1, 'Instalación eléctrica', 'Agregar 4 tomas y modernizar tablero.', 'Av. Corrientes 1234', 'CABA', 'C1043', '2025-12-20', 'mañana', 35000.00, 'aceptada'),
(3, 2, 'Reparación de cañería', 'Pérdida importante en baño, se escucha goteo.', 'Calle 50 n° 567', 'La Plata', '1900', '2025-12-18', 'tarde', 15000.00, 'en_progreso'),
(4, NULL, 'Colocación de luminarias', 'Instalar 6 spots en living y pasillo.', 'Blanco Encalada 234', 'CABA', 'C1431', '2025-12-22', 'tarde', 12000.00, 'pendiente'),
(5, 3, 'Instalación de calefón', 'Instalar calefón a gas natural.', 'Mitre 233', 'Avellaneda', '1870', '2025-12-23', 'mañana', 45000.00, 'completada'),
(6, 4, 'Revisión eléctrica', 'Luces se apagan al encender microondas.', 'Virrey Loreto 321', 'CABA', 'C1426', '2025-12-19', 'tarde', 8000.00, 'pendiente'),
(7, 5, 'Destape de cocina', 'Desagüe tapado, olor fuerte.', 'Neuquén 998', 'CABA', 'C1406', '2025-12-21', 'mañana', 6000.00, 'cancelada'),
(8, 6, 'Chequeo de estufa', 'Revisión por olor a gas leve.', 'Larrea 554', 'CABA', 'C1114', '2025-12-24', 'tarde', 9000.00, 'completada'),
(9, 7, 'Cableado nuevo', 'Reemplazar cableado viejo en dormitorio.', 'Inclán 223', 'CABA', 'C1241', '2025-12-26', 'mañana', 18000.00, 'en_progreso'),
(10, 8, 'Cambio de bomba de agua', 'Bomba deja de cebar, revisar.', 'Uspallata 123', 'CABA', 'C1261', '2025-12-27', 'mañana', 22000.00, 'aceptada'),
(11, 9, 'Certificación de gas', 'Necesito certificado para habilitación.', 'Sarmiento 443', 'CABA', 'C1041', '2025-12-28', 'tarde', 30000.00, 'pendiente'),
(12, 10, 'Tablero trifásico', 'Instalar tablero con protecciones nuevas.', 'Caseros 890', 'CABA', 'C1152', '2025-12-29', 'mañana', 50000.00, 'completada'),
(13, 11, 'Filtración en baño', 'Humedad en pared lindera.', 'Suipacha 450', 'CABA', 'C1008', '2025-12-30', 'tarde', 14000.00, 'rechazada'),
(14, 12, 'Calefactor sin encender', 'No prende chispa.', 'Yapeyú 345', 'CABA', 'C1201', '2025-12-19', 'mañana', 11000.00, 'completada'),
(15, 13, 'Luces parpadean', 'Posible neutro suelto.', 'Bacacay 1500', 'CABA', 'C1407', '2025-12-18', 'noche', 7000.00, 'pendiente'),
(16, 14, 'Perdida en cocina', 'Se filtra agua en bajo mesada.', 'Castelli 77', 'CABA', 'C1036', '2025-12-25', 'tarde', 9000.00, 'aceptada');

-- ============================================
-- MENSAJES (chat)
-- ============================================
INSERT INTO mensajes (solicitud_id, autor_id, contenido) VALUES
(1, 2, 'Hola, ¿podés venir esta semana?'),
(1, 17, 'Sí, el jueves por la mañana confirmo.'),
(2, 3, 'La pérdida creció, ¿pueden venir antes?'),
(2, 18, 'Estoy camino, llego en 1 hora.'),
(5, 6, '¿Te sirve mañana por la tarde?'),
(5, 20, 'Prefiero por la mañana, gracias.'),
(8, 9, '¿Cuánto demora el trabajo?'),
(8, 23, 'En 3 horas lo dejo listo.'),
(10, 10, 'Necesito factura A.'),
(10, 24, 'De acuerdo, la llevo.'),
(12, 12, 'Confirmo fecha 29/12.'),
(12, 26, 'Confirmado, llevo materiales.');

-- ============================================
-- REVIEWS (una por solicitud completada)
-- ============================================
INSERT INTO reviews (solicitud_id, cliente_id, profesional_id, calificacion, comentario, estado) VALUES
(1, 2, 1, 5, 'Trabajo prolijo y puntual. Muy recomendado.', 'aprobada'),
(5, 6, 4, 4, 'Revisión rápida, buen trato.', 'aprobada'),
(8, 8, 6, 5, 'Detectó y solucionó la fuga al instante.', 'aprobada'),
(10, 10, 8, 4, 'Cambio de bomba sin problemas.', 'pendiente'),
(12, 12, 10, 5, 'Tablero quedó impecable, explicó todo.', 'aprobada'),
(14, 14, 12, 5, 'Calefactor funcionando perfecto.', 'pendiente');
