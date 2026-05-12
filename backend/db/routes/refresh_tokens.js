import { pool } from '../db.js'

export async function insertRefreshToken(tenant_id, token, id_usuario, device) {
    const today = new Date()
    const expirationDay = new Date(today)
    expirationDay.setDate(expirationDay.getDate() + 30)
    //Poniendo la fecha para la expiracion
    const query = 'INSERT INTO refresh_tokens(tenant_id,user_id,refresh_token,fecha_expiracion,dispositivo) VALUES (?, ? , ?, ? , ?)'
    const [result] = await pool.query(query, [tenant_id, id_usuario, token, expirationDay, device])

    if (result.affectedRows === 0) {
        return false
    }
    return true
}
//ME QUEDE CON LOS REFRESH TOKENS Y ASI 
export async function verifyRefreshToken(token, device) {
    const query = 'SELECT refresh_token FROM refresh_tokens WHERE refresh_token = ? AND dispositivo = ? and esta_revocado = 0;'
    const [rows] = await pool.query(query, [token, device])
    if (!rows.length) {
        return false
    }
    return true
}