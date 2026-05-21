import { pool } from '../db.js'

export async function getUserData(email, tenant_id) {
    const query = 'SELECT id_usuario,password_hash,id_rol FROM usuarios WHERE correo = ? AND tenant_id = ? AND activo = TRUE;'
    const [rows] = await pool.query(query, [email, tenant_id])
    if (!rows.length) {
        return null
    }
    return rows[0]
}

