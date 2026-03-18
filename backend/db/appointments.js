import { pool } from './db.js'

export async function createAppointment(userId, specialistId, date, time, reason) {
    try {
        const query = `INSERT INTO citas (id_paciente, id_especialista, fecha, hora_inicio, hora_fin, estado, motivo_consulta) VALUES 
    (?, ?, ?, ?, ?, 'PROGRAMADA', ?);`
        //Para la hora fin
        finish_time = time + 30
        const [result] = await pool.query(query, [userId, specialistId, date, time, finish_time, reason])
        return { success: true, appointmentId: result.id_cita }
    } catch (e) {
        return { success: false, error: e }
    }
}