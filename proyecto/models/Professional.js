/**
 * МОДЕЛЬ: PROFESSIONAL (Профессионал)
 * 
 * Работа с таблицей professionals - расширенная информация о профессионалах
 */

const { createConnection } = require('../config/database');

class Professional {
    /**
     * Найти профессионала по user_id
     * @param {number} userId 
     * @returns {Promise<Object|null>}
     */
    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                `SELECT p.*, u.nombre, u.email, u.telefono, u.direccion, u.avatar
                 FROM professionals p
                 JOIN users u ON p.user_id = u.id
                 WHERE p.user_id = ?`,
                [userId],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    /**
     * Найти профессионала по ID
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                `SELECT p.*, u.nombre, u.email, u.telefono, u.direccion, u.avatar
                 FROM professionals p
                 JOIN users u ON p.user_id = u.id
                 WHERE p.id = ?`,
                [id],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    /**
     * Получить список профессионалов с фильтрами
     * @param {Object} options - опции фильтрации и пагинации
     * @returns {Promise<Array>}
     */
    static findAll(options = {}) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const {
                especialidad = null,
                ubicacion = null,
                calificacionMin = null,
                verificado = null,
                limit = 12,
                offset = 0
            } = options;

            let query = `
                SELECT p.*, u.nombre, u.email, u.telefono, u.avatar
                FROM professionals p
                JOIN users u ON p.user_id = u.id
                WHERE 1=1
            `;
            const params = [];

            // Фильтр по специальности
            if (especialidad) {
                query += ' AND p.especialidad = ?';
                params.push(especialidad);
            }

            // Фильтр по верификации
            if (verificado !== null) {
                query += ' AND p.verificado = ?';
                params.push(verificado ? 1 : 0);
            }

            if (calificacionMin) {
                query += ' AND p.calificacion_promedio >= ?';
                params.push(calificacionMin);
            }

            if (ubicacion) {
                query += ' AND (LOWER(u.direccion) LIKE ? OR LOWER(p.zona_cobertura) LIKE ?)';
                const like = `%${ubicacion.toLowerCase()}%`;
                params.push(like, like);
            }

            // Сортировка и пагинация
            query += ' ORDER BY p.calificacion_promedio DESC, p.trabajos_completados DESC';
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);

            db.all(query, params, (err, rows) => {
                db.close();
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }

    /**
     * Создать профиль профессионала
     * @param {Object} data 
     * @returns {Promise<number>}
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { user_id, especialidad, experiencia, descripcion, foto_url, zona_cobertura } = data;
            
            db.run(
                `INSERT INTO professionals (user_id, especialidad, experiencia, descripcion, foto_url, zona_cobertura, verificado) 
                 VALUES (?, ?, ?, ?, ?, ?, 0)`,
                [user_id, especialidad, experiencia || 0, descripcion || '', foto_url || null, zona_cobertura || null],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    /**
     * Обновить профиль профессионала
     * @param {number} id 
     * @param {Object} data 
     * @returns {Promise<boolean>}
     */
    static update(id, data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { especialidad, experiencia, descripcion, foto_url, zona_cobertura } = data;
            
            db.run(
                `UPDATE professionals 
                 SET especialidad = ?, experiencia = ?, descripcion = ?, foto_url = ?, zona_cobertura = ?
                 WHERE id = ?`,
                [especialidad, experiencia, descripcion, foto_url, zona_cobertura, id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    /**
     * Верифицировать/отклонить профессионала (админ)
     * @param {number} id 
     * @param {boolean} verificado 
     * @returns {Promise<boolean>}
     */
    static setVerificado(id, verificado) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.run(
                'UPDATE professionals SET verificado = ? WHERE id = ?',
                [verificado ? 1 : 0, id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    /**
     * Обновить рейтинг профессионала
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static updateRating(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            // Пересчитываем средний рейтинг из одобренных отзывов
            db.run(
                `UPDATE professionals 
                 SET calificacion_promedio = (
                     SELECT AVG(calificacion) 
                     FROM reviews 
                     WHERE profesional_id = ? AND estado = 'aprobada'
                 )
                 WHERE id = ?`,
                [id, id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    /**
     * Подсчитать количество профессионалов
     * @param {Object} filters 
     * @returns {Promise<number>}
     */
    static count(filters = {}) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { especialidad = null, verificado = null, calificacionMin = null, ubicacion = null } = filters;

            let query = 'SELECT COUNT(*) as total FROM professionals WHERE 1=1';
            const params = [];

            if (especialidad) {
                query += ' AND especialidad = ?';
                params.push(especialidad);
            }

            if (verificado !== null) {
                query += ' AND verificado = ?';
                params.push(verificado ? 1 : 0);
            }

            if (calificacionMin) {
                query += ' AND calificacion_promedio >= ?';
                params.push(calificacionMin);
            }

            if (ubicacion) {
                query += ' AND (LOWER(zona_cobertura) LIKE ?)';
                params.push(`%${ubicacion.toLowerCase()}%`);
            }

            db.get(query, params, (err, row) => {
                db.close();
                if (err) reject(err);
                else resolve(row.total);
            });
        });
    }
}

module.exports = Professional;
