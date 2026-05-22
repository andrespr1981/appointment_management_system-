import pool from '../db.js'

export async function registerUser(name, lastName, email, tel, password, tenant_id) {
    try {
        const query = 'INSERT INTO usuarios(id_rol,nombre,apellido,correo,telefono,password_hash,tenant_id) VALUES (?,?,?,?,?,?,?)'
        const [result] = await pool.query(query, [2, name, lastName, email, tel, password, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('SELECT', 'usuarios', query)
            return { success: true, id_usuario: result.insertId }
        }
    } catch (e) {
        return { success: false, error: e }
    }
}
//Insertar roles para comprobar que funciona
export async function isAlreadyRegister(email, tenant_id) {
    const query = 'SELECT id_usuario FROM usuarios WHERE correo = ? AND tenant_id = ?'
    const [rows] = await pool.query(query, [email, tenant_id])
    await registerConsult('SELECT', 'usuarios', query)
    if (!rows.length) {
        return false
    }
    return true
}