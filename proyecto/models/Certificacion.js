/**
 * МОДЕЛЬ: CERTIFICACION
 * 
 * Manejo de certificados de profesionales.
 */

const { createConnection } = require('../config/database');

class Certificacion {
    /**
     * Obtener certificaciones por profesional
     * @param {number} professionalId 
     * @returns {Promise<Array>}
     */
    static findByProfessional(professionalId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.all(
                'SELECT * FROM certificaciones WHERE professional_id = ? ORDER BY created_at DESC',
                [professionalId],
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    /**
     * Crear certificación
     * @param {Object} data 
     * @returns {Promise<number>}
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { professional_id, nombre, archivo } = data;
            db.run(
                'INSERT INTO certificaciones (professional_id, nombre, archivo) VALUES (?, ?, ?)',
                [professional_id, nombre, archivo],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    /**
     * Eliminar certificación
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.run('DELETE FROM certificaciones WHERE id = ?', [id], function(err) {
                db.close();
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

module.exports = Certificacion;
