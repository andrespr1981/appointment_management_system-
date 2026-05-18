import { pool } from '../db.js'

export async function insertRefreshToken(token, id_usuario, device, tenant_id) {
    const today = new Date()
    const expirationDay = new Date(today)
    expirationDay.setDate(expirationDay.getDate() + 30)
    //Poniendo la fecha para la expiracion
    const query = 'INSERT INTO refresh_tokens(user_id,refresh_token,fecha_expiracion,dispositivo,tenant_id) VALUES (?, ? , ?, ? , ?)'
    const [result] = await pool.query(query, [id_usuario, token, expirationDay, device, tenant_id])

    if (result.affectedRows === 0) {
        return false
    }
    return true
}

export async function revokeRefreshToken(id_user, device, tenant_id) {
    const query = 'UPDATE refresh_tokens SET esta_revocado = 1 WHERE user_id = ? AND dispositivo = ? AND esta_revocado = 0 AND tenant_id = ?;'
    const [rows] = await pool.query(query, [id_user, device, tenant_id],)
    if (!rows.length) {
        return rows[0]
    }
    return true
}

export async function verifyRefreshToken(token, device, tenant_id) {
    const query = 'SELECT refresh_token FROM refresh_tokens WHERE refresh_token = ? AND dispositivo = ? AND esta_revocado = 0 AND tenant_id = ?;'
    const [rows] = await pool.query(query, [token, device, tenant_id],)
    if (!rows.length) {
        return false
    }
    return true
}