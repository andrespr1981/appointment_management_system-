import pool from './db.js'

export async function getSpecialities() {
    const query = 'SELECT id_especialidad, nombre FROM especialidades ;'
    const [rows] = await pool.query(query)
    return rows
}

