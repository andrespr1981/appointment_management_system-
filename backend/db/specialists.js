import pool from './db.js'

export async function getSpecialists() {
    const query = 'SELECT especialistas.id_especialista,usuarios.nombre,usuarios.apellido FROM usuarios JOIN ON usuarios.id_usuario = especialistas.id_usuario WHERE id_rol = 3;'
    const [rows] = await pool.query(query)
    return rows
}

export async function getSpecialistsBySpeciality(specialityID) {
    const query = 'SELECT especialistas.id_especialista,usuarios.nombre,usuarios.apellido FROM usuarios JOIN ON usuarios.id_usuario = especialistas.id_usuario WHERE especialistas.id_especialidad = ?;'
    const [rows] = await pool.query(query, [specialityID])
    return rows
}

