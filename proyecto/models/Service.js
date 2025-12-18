/**
 * МОДЕЛЬ: Servicios de profesionales
 */
const { createConnection } = require('../config/database');

class Service {
    static findByProfessional(professionalId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.all(
                'SELECT * FROM professional_services WHERE professional_id = ? ORDER BY created_at DESC',
                [professionalId],
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            const { professional_id, nombre, precio_desde, precio_hasta } = data;
            db.run(
                `INSERT INTO professional_services (professional_id, nombre, precio_desde, precio_hasta)
                 VALUES (?, ?, ?, ?)`,
                [professional_id, nombre, precio_desde || null, precio_hasta || null],
                function(err) {
                    db.close();
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.run('DELETE FROM professional_services WHERE id = ?', [id], function(err) {
                db.close();
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

module.exports = Service;
