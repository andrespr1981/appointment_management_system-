import { pool } from '../db.js'

export async function getAppoinmentsByUser(userId, tenant_id) {
    try {
        const query = `
        SELECT 
            c.id_cita,
            c.id_especialista,
            c.fecha,
            c.hora_inicio,
            c.hora_fin,
            c.estado,
            c.motivo_consulta,
            c.fecha_creacion,
            u.nombre AS nombre_especialista,
            u.apellido AS apellido_especialista,
            e.costo_consulta
        FROM citas c
        INNER JOIN especialistas e 
            ON c.id_especialista = e.id_especialista 
            AND c.tenant_id = e.tenant_id
        INNER JOIN usuarios u 
            ON e.id_usuario = u.id_usuario 
            AND e.tenant_id = u.tenant_id
        WHERE c.id_paciente = ? 
        AND c.tenant_id = ?;
        `
        const [appointmens] = await pool.query(query, [userId, tenant_id])
        await registerConsult('SELECT', 'citas', query)
        return { success: true, appointments: appointmens }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function createAppointment(userId, specialistId, date, time, reason, tenant_id) {
    try {
        const query = `INSERT INTO citas 
        (id_paciente, id_especialista, fecha, hora_inicio, hora_fin, estado, motivo_consulta) 
        VALUES 
        (?, ?, ?, ?, ?, 'PROGRAMADA', ?) WHERE tenant_id = ?;`
        //Para la hora fin
        const finish_time = time + 30
        const [rows] = await pool.query(query, [userId, specialistId, date, time, finish_time, reason, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('INSERT', 'usuarios', query)
            return { success: true, appointmentId: result.insertId }
        }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function deleteAppointment(appointmentId) {
    try {
        const query = `UPDATE citas SET estado = 'CANCELADA' where id_cita = ?;`
        const [result] = await pool.query(query, [appointmentId])
        if (rows.affectedRows > 0) {
            await registerConsult('UPDATE', 'usuarios', query)
            return { success: true, appointmentId: appointmentId }
        }
        return { success: false }
    } catch (e) {
        return { success: false, error: e }
    }
}