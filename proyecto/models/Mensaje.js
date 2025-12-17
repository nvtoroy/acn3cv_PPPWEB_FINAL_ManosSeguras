/**
 * МОДЕЛЬ: MENSAJE (Сообщения в чате заявки)
 * 
 * Работа с таблицей mensajes - переписка между клиентом и профессионалом
 */

const { createConnection } = require('../config/database');

class Mensaje {
    /**
     * Получить все сообщения заявки
     * @param {number} solicitudId 
     * @returns {Promise<Array>}
     */
    static findBySolicitud(solicitudId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.all(
                `SELECT m.*, u.nombre as autor_nombre, u.rol as autor_rol
                 FROM mensajes m
                 JOIN users u ON m.autor_id = u.id
                 WHERE m.solicitud_id = ?
                 ORDER BY m.created_at ASC`,
                [solicitudId],
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    /**
     * Создать новое сообщение
     * @param {Object} data 
     * @returns {Promise<number>}
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { solicitud_id, autor_id, contenido } = data;
            
            db.run(
                'INSERT INTO mensajes (solicitud_id, autor_id, contenido) VALUES (?, ?, ?)',
                [solicitud_id, autor_id, contenido],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    /**
     * Подсчитать количество сообщений в заявке
     * @param {number} solicitudId 
     * @returns {Promise<number>}
     */
    static countBySolicitud(solicitudId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                'SELECT COUNT(*) as total FROM mensajes WHERE solicitud_id = ?',
                [solicitudId],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });
    }

    /**
     * Удалить сообщение
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.run('DELETE FROM mensajes WHERE id = ?', [id], function(err) {
                db.close();
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

module.exports = Mensaje;
