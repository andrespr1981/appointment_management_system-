import pool from '../db.js'

export async function getSpecialists(tenant_id) {
    try {
        const query = `
            SELECT 
        e.id_especialista,
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.correo,
        u.telefono,
        e.cedula_profesional,
        e.costo_consulta,
        esp.nombre AS nombre_especialidad
        FROM especialistas e
        INNER JOIN usuarios u 
            ON e.id_usuario = u.id_usuario
        INNER JOIN especialidades esp
            ON e.id_especialidad = esp.id_especialidad
        WHERE e.tenant_id = ?;
        `;
        const [rows] = await pool.query(query, [tenant_id]);
        return { success: true, specialists: rows };
    } catch (e) {
        return { success: false, error: e };
    }
}


export async function getSpecialistsBySpeciality(id_speciality, tenant_id) {
    try {
        const query = `
        SELECT 
    e.id_especialista,
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.correo,
    u.telefono,
    e.cedula_profesional,
    e.costo_consulta,
    esp.nombre AS nombre_especialidad
    FROM especialistas e
    INNER JOIN usuarios u 
        ON e.id_usuario = u.id_usuario
    INNER JOIN especialidades esp
        ON e.id_especialidad = esp.id_especialidad
    WHERE e.id_especialidad = ?
    AND e.tenant_id = ?;
        `
        const [rows] = await pool.query(query, [id_speciality, tenant_id])
        return { success: true, specialists: rows }
    } catch (e) {
        return { success: false }
    }
}

export async function getSpecialistData(id_specialist, tenant_id) {
    try {
        const query = `
        SELECT 
    e.id_especialista,
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.correo,
    u.telefono,
    e.cedula_profesional,
    e.costo_consulta,
    esp.nombre AS nombre_especialidad
    FROM especialistas e
    INNER JOIN usuarios u 
        ON e.id_usuario = u.id_usuario
    INNER JOIN especialidades esp
        ON e.id_especialidad = esp.id_especialidad
    WHERE e.id_especialista = ?
    AND e.tenant_id = ?;`
        const [rows] = await pool.query(query, [id_specialist, tenant_id])
        return { success: true, specialist_data: rows }
    } catch (e) {
        return { success: false }
    }
}

export async function updateSpecialist(id_specialist, cedula, price, tenant_id) {
    try {
        const query = `UPDATE especialistas SET 
            cedula_profesional = ?, 
            costo_consulta = ? 
            WHERE id_especialista = ? AND tenant_id = ?
            ;`
        const [rows] = await pool.query(query, [cedula, price, id_specialist, tenant_id])
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function deleteSpecialist(id_specialist, tenant_id) {
    try {
        const query = `DELETE FROM especialistas WHERE id_especialista = ? AND tenant_id = ?;`
        const [rows] = await pool.query(query, [id_specialist, tenant_id])
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}