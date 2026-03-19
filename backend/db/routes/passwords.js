import { pool } from '../db.js'

export async function getUserData(email) {
    const query = 'SELECT id_usuario,password_hash FROM usuarios WHERE correo = ?'
    const [rows] = await pool.query(query, [email])
    if (!rows.length) {
        return null
    }
    return rows[0]
}

