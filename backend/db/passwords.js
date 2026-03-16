import { pool } from './db.js'

export async function getPassword(email) {
    const query = 'SELECT password_hash FROM usuarios WHERE correo = ?'
    const [rows] = await pool.query(query, [email])
    if (!rows.length) {
        return null
    }
    return rows[0]
}

