/**
 * МОДЕЛЬ: Availability (Disponibilidad de profesionales)
 */

const { createConnection } = require('../config/database');

class Availability {
    static findByProfessional(professionalId) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.all(
                'SELECT fecha, estado FROM professional_availability WHERE professional_id = ? ORDER BY fecha ASC',
                [professionalId],
                (err, rows) => {
                    db.close();
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    static replaceAll(professionalId, slots) {
        return new Promise((resolve, reject) => {
            const db = createConnection();
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('DELETE FROM professional_availability WHERE professional_id = ?', [professionalId]);

                const stmt = db.prepare('INSERT INTO professional_availability (professional_id, fecha, estado) VALUES (?, ?, ?)');
                slots.forEach(({ fecha, estado }) => {
                    if (fecha && estado) {
                        stmt.run([professionalId, fecha, estado]);
                    }
                });
                stmt.finalize(err => {
                    if (err) {
                        db.run('ROLLBACK');
                        db.close();
                        return reject(err);
                    }
                    db.run('COMMIT', (commitErr) => {
                        db.close();
                        if (commitErr) return reject(commitErr);
                        resolve(true);
                    });
                });
            });
        });
    }
}

module.exports = Availability;
