import { pool } from '../db.js'

export async function getRefreshToken(token) {
    const query = 'SELECT refresh_token FROM refresh_token WHERE refresh_token = ?;'
    const [rows] = await pool.query(query, [token])
    if (!rows.length) {
        return null
    }
    return rows[0]
}