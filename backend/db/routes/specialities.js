import pool from '../db.js'

export async function getSpecialities(tenant_id) {
    try {
        const query = 'SELECT id_especialidad, nombre, descripcion FROM especialidades WHERE tenant_id = ?;'
        const [rows] = await pool.query(query, [tenant_id])
        await registerConsult('SELECT', 'especialidades', query)
        return { success: true, specialities: rows }
    } catch (e) {
        return { success: false }
    }
}

export async function createSpeciality(name, descripcion, tenant_id) {
    try {
        const query = 'INSERT INTO especialidades(nombre,descripcion,tenant_id) VALUES (?,?,?)'
        const [rows] = await pool.query(query, [name, descripcion, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('INSERT', 'especialidades', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}

export async function updateSpeciality(id_speciality, name, description, tenant_id) {
    try {
        const query = `UPDATE especialidades SET 
            nombre = ?, 
            descripcion = ?
            WHERE id_especialidad = ? AND tenant_id = ?
            ;`
        const [rows] = await pool.query(query, [name, description, id_speciality, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('UPDATE', 'especialidades', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}

export async function deleteSpeciality(id_speciality, tenant_id) {
    try {
        const query = `DELETE FROM especialidades WHERE id_especialidad = ? AND tenant_id = ?;`
        const [rows] = await pool.query(query, [id_speciality, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('DELETE', 'especialidades', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}

