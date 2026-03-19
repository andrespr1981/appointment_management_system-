import { pool } from '../db.js'

export async function getAppoinmentsByUser(userId) {
    try {
        const query = `;`
        const [appointmens] = await pool.query(query, [userId, specialistId, date, time, finish_time, reason])
        return { success: true, appointments: appointmens }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function createAppointment(userId, specialistId, date, time, reason) {
    try {
        const query = `INSERT INTO citas 
        (id_paciente, id_especialista, fecha, hora_inicio, hora_fin, estado, motivo_consulta) 
        VALUES 
        (?, ?, ?, ?, ?, 'PROGRAMADA', ?);`
        //Para la hora fin
        finish_time = time + 30
        const [result] = await pool.query(query, [userId, specialistId, date, time, finish_time, reason])
        return { success: true, appointmentId: result.id_cita }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function deleteAppointment(appointmentId) {
    try {
        const query = `UPDATE citas SET estado = 'CANCELADA' where id_cita = ?;`
        const [result] = await pool.query(query, [appointmentId])
        return { success: true, appointmentId: result.id_cita }
    } catch (e) {
        return { success: false, error: e }
    }
}