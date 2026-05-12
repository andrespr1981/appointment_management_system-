import { pool } from '../db.js'

export async function getUserData(email) {
    const query = 'SELECT id_usuario,password_hash,id_rol FROM usuarios WHERE correo = ?'
    const [rows] = await pool.query(query, [email])
    if (!rows.length) {
        return null
    }
    return rows[0]
}

