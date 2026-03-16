import pool from './db.js'

export async function registerUser(name, lastName, email, tel, password) {
    const query = 'INSERT INTO usuarios(id_rol,nombre,apellido,correo,telefono,password_hash) VALUES (?,?,?,?,?,?)'
    const [rows] = await pool.query(query, ['2', name, lastName, email, tel, password])
    return rows.id_usuario
}

export async function isAlreadyRegister(email) {
    const query = 'SELECT id_usuario FROM usuarios WHERE correo = ?'
    const [rows] = await pool.query(query, [email])
    if (!rows.length) {
        return false
    }
    return true
}