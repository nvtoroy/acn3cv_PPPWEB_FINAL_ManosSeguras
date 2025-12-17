/**
 * МОДЕЛЬ: SOLICITUD (Заявка на услугу)
 * 
 * Работа с таблицей solicitudes - заявки от клиентов
 */

const { createConnection } = require('../config/database');

class Solicitud {
    /**
     * Найти заявку по ID
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                `SELECT s.*, 
                        c.nombre as cliente_nombre, c.email as cliente_email, c.telefono as cliente_telefono,
                        p.id as prof_id, u.nombre as profesional_nombre, u.email as profesional_email
                 FROM solicitudes s
                 JOIN users c ON s.cliente_id = c.id
                 LEFT JOIN professionals p ON s.profesional_id = p.id
                 LEFT JOIN users u ON p.user_id = u.id
                 WHERE s.id = ?`,
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
     * Получить заявки с фильтрами
     * @param {Object} options 
     * @returns {Promise<Array>}
     */
    static findAll(options = {}) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const {
                cliente_id = null,
                profesional_id = null,
                estado = null,
                limit = 20,
                offset = 0
            } = options;

            let query = `
                SELECT s.*, 
                       c.nombre as cliente_nombre,
                       u.nombre as profesional_nombre
                FROM solicitudes s
                JOIN users c ON s.cliente_id = c.id
                LEFT JOIN professionals p ON s.profesional_id = p.id
                LEFT JOIN users u ON p.user_id = u.id
                WHERE 1=1
            `;
            const params = [];

            if (cliente_id) {
                query += ' AND s.cliente_id = ?';
                params.push(cliente_id);
            }

            if (profesional_id) {
                query += ' AND s.profesional_id = ?';
                params.push(profesional_id);
            }

            if (estado) {
                query += ' AND s.estado = ?';
                params.push(estado);
            }

            query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            db.all(query, params, (err, rows) => {
                db.close();
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }

    /**
     * Создать новую заявку
     * @param {Object} data 
     * @returns {Promise<number>}
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const {
                cliente_id,
                tipo_servicio,
                descripcion,
                direccion,
                ciudad,
                codigo_postal,
                fecha_preferida,
                horario,
                presupuesto_estimado,
                profesional_id = null
            } = data;
            
            db.run(
                `INSERT INTO solicitudes 
                 (cliente_id, profesional_id, tipo_servicio, descripcion, direccion, ciudad, codigo_postal, fecha_preferida, horario, presupuesto_estimado, estado) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
                [cliente_id, profesional_id || null, tipo_servicio, descripcion, direccion, ciudad, codigo_postal, fecha_preferida, horario, presupuesto_estimado],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    /**
     * Обновить estado заявки
     * @param {number} id 
     * @param {string} estado 
     * @param {number} profesional_id - опционально при aceptar
     * @returns {Promise<boolean>}
     */
    static updateEstado(id, estado, profesional_id = null) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            let query = 'UPDATE solicitudes SET estado = ?, updated_at = CURRENT_TIMESTAMP';
            const params = [estado];
            
            if (profesional_id) {
                query += ', profesional_id = ?';
                params.push(profesional_id);
            }
            
            query += ' WHERE id = ?';
            params.push(id);
            
            db.run(query, params, function(err) {
                db.close();
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }

    /**
     * Подсчитать количество заявок
     * @param {Object} filters 
     * @returns {Promise<number>}
     */
    static count(filters = {}) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { cliente_id = null, profesional_id = null, estado = null } = filters;

            let query = 'SELECT COUNT(*) as total FROM solicitudes WHERE 1=1';
            const params = [];

            if (cliente_id) {
                query += ' AND cliente_id = ?';
                params.push(cliente_id);
            }

            if (profesional_id) {
                query += ' AND profesional_id = ?';
                params.push(profesional_id);
            }

            if (estado) {
                query += ' AND estado = ?';
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
     * Удалить заявку
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.run('DELETE FROM solicitudes WHERE id = ?', [id], function(err) {
                db.close();
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

module.exports = Solicitud;
