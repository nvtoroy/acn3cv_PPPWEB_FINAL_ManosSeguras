/**
 * МОДЕЛЬ: REVIEW (Отзывы о профессионалах)
 * 
 * Работа с таблицей reviews - отзывы клиентов о выполненных работах
 */

const { createConnection } = require('../config/database');

class Review {
    /**
     * Найти отзыв по ID
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                `SELECT r.*, 
                        c.nombre as cliente_nombre,
                        p.id as prof_id, u.nombre as profesional_nombre,
                        s.tipo_servicio
                 FROM reviews r
                 JOIN users c ON r.cliente_id = c.id
                 JOIN professionals p ON r.profesional_id = p.id
                 JOIN users u ON p.user_id = u.id
                 JOIN solicitudes s ON r.solicitud_id = s.id
                 WHERE r.id = ?`,
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
     * Получить отзывы профессионала (только одобренные для публичного профиля)
     * @param {number} professionalId 
     * @param {boolean} onlyApproved - только одобренные
     * @returns {Promise<Array>}
     */
    static findByProfessional(professionalId, onlyApproved = true) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            let query = `
                SELECT r.*, c.nombre as cliente_nombre, s.tipo_servicio
                FROM reviews r
                JOIN users c ON r.cliente_id = c.id
                JOIN solicitudes s ON r.solicitud_id = s.id
                WHERE r.profesional_id = ?
            `;
            
            if (onlyApproved) {
                query += " AND r.estado = 'aprobada'";
            }
            
            query += ' ORDER BY r.created_at DESC';
            
            db.all(query, [professionalId], (err, rows) => {
                db.close();
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }

    /**
     * Получить все отзывы (для админ-панели)
     * @param {string} estado - фильтр по статусу
     * @param {number} limit 
     * @param {number} offset 
     * @returns {Promise<Array>}
     */
    static findAll(estado = null, limit = 20, offset = 0) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            let query = `
                SELECT r.*, 
                       c.nombre as cliente_nombre,
                       u.nombre as profesional_nombre,
                       s.tipo_servicio
                FROM reviews r
                JOIN users c ON r.cliente_id = c.id
                JOIN professionals p ON r.profesional_id = p.id
                JOIN users u ON p.user_id = u.id
                JOIN solicitudes s ON r.solicitud_id = s.id
            `;
            const params = [];
            
            if (estado) {
                query += ' WHERE r.estado = ?';
                params.push(estado);
            }
            
            query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);
            
            db.all(query, params, (err, rows) => {
                db.close();
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }

    /**
     * Создать новый отзыв
     * @param {Object} data 
     * @returns {Promise<number>}
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { solicitud_id, cliente_id, profesional_id, calificacion, comentario } = data;
            
            db.run(
                `INSERT INTO reviews (solicitud_id, cliente_id, profesional_id, calificacion, comentario, estado)
                 VALUES (?, ?, ?, ?, ?, 'pendiente')`,
                [solicitud_id, cliente_id, profesional_id, calificacion, comentario],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    /**
     * Одобрить/отклонить отзыв (админ)
     * @param {number} id 
     * @param {string} estado - 'aprobada' или 'rechazada'
     * @returns {Promise<boolean>}
     */
    static updateEstado(id, estado) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.run(
                'UPDATE reviews SET estado = ? WHERE id = ?',
                [estado, id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    /**
     * Проверить есть ли уже отзыв для заявки
     * @param {number} solicitudId 
     * @returns {Promise<boolean>}
     */
    static existsForSolicitud(solicitudId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                'SELECT id FROM reviews WHERE solicitud_id = ?',
                [solicitudId],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(!!row);
                }
            );
        });
    }

    /**
     * Подсчитать количество отзывов
     * @param {string} estado 
     * @returns {Promise<number>}
     */
    static count(estado = null) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            let query = 'SELECT COUNT(*) as total FROM reviews';
            const params = [];
            
            if (estado) {
                query += ' WHERE estado = ?';
                params.push(estado);
            }
            
            db.get(query, params, (err, row) => {
                db.close();
                if (err) reject(err);
                else resolve(row.total);
            });
        });
    }

    /**
     * Удалить отзыв
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.run('DELETE FROM reviews WHERE id = ?', [id], function(err) {
                db.close();
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

module.exports = Review;
