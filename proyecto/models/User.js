/**
 * МОДЕЛЬ: USER (Пользователь)
 * 
 * Работа с таблицей users - клиенты, профессионалы и админы
 */

const { createConnection } = require('../config/database');

class User {
    /**
     * Найти пользователя по email
     * @param {string} email 
     * @returns {Promise<Object|null>} - объект пользователя или null
     */
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    /**
     * Obtener usuario con hash de contraseña
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static findByIdWithPassword(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.get(
                'SELECT * FROM users WHERE id = ?',
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
     * Actualizar contraseña
     * @param {number} id 
     * @param {string} hashedPassword 
     * @returns {Promise<boolean>}
     */
    static updatePassword(id, hashedPassword) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.run(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    /**
     * Найти пользователя по ID
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                'SELECT id, nombre, email, telefono, direccion, rol, avatar, created_at FROM users WHERE id = ?',
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
     * Создать нового пользователя
     * @param {Object} userData - данные пользователя
     * @returns {Promise<number>} - ID созданного пользователя
     */
    static create(userData) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { nombre, email, password, telefono, direccion, rol } = userData;
            
            db.run(
                `INSERT INTO users (nombre, email, password, telefono, direccion, rol) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, email, password, telefono || null, direccion || null, rol || 'cliente'],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);  // Возвращаем ID нового пользователя
                }
            );
        });
    }

    /**
     * Обновить данные пользователя
     * @param {number} id 
     * @param {Object} userData 
     * @returns {Promise<boolean>}
     */
    static update(id, userData) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { nombre, telefono, direccion, avatar } = userData;
            
            db.run(
                `UPDATE users 
                 SET nombre = ?, telefono = ?, direccion = ?, avatar = ?
                 WHERE id = ?`,
                [nombre, telefono, direccion, avatar, id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    /**
     * Получить всех пользователей (для админ-панели)
     * @param {number} limit - количество записей
     * @param {number} offset - смещение для пагинации
     * @returns {Promise<Array>}
     */
    static findAll(limit = 30, offset = 0) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.all(
                `SELECT id, nombre, email, telefono, rol, created_at 
                 FROM users 
                 ORDER BY created_at DESC
                 LIMIT ? OFFSET ?`,
                [limit, offset],
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    /**
     * Подсчитать общее количество пользователей
     * @returns {Promise<number>}
     */
    static count() {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.get(
                'SELECT COUNT(*) as total FROM users',
                (err, row) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });
    }

    /**
     * Удалить пользователя
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            
            db.run(
                'DELETE FROM users WHERE id = ?',
                [id],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }
}

module.exports = User;
