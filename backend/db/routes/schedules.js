import pool from '../db.js'

export async function getScheduleBySpecialist(id_specialist, tenant_id) {
    try {
        const query = 'SELECT id_horario,fecha,hora_inicio,hora_fin FROM horarios_disponibles WHERE id_especialista = ? AND tenant_id = ?;'
        const [rows] = await pool.query(query, [id_specialist, tenant_id])
        await registerConsult('SELECT', 'horarios_disponibles', query)
        return { success: true, schedules: rows }
    } catch (e) {
        return { success: false }
    }
}

export async function createNewSchedule(id_specialist, date, schedule, tenant_id) {
    try {
        const query = `INSERT INTO horarios_disponibles(id_especialista,fecha,hora_inicio,hora_fin,disponible,tenant_id)
                    VALUES(?,?,?,?,?,?);
        ;`
        const [rows] = await pool.query(query, [id_specialist, date, schedule.hora_inicio, schedule.hora_fin, '1', tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('INSERT', 'horarios_disponibles', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}

export async function updateSchedule(id_schedule, date, schedule, tenant_id) {
    try {
        const query = `UPDATE horarios_disponibles SET 
        fecha = ?, 
        hora_inicio = ?, 
        hora_fin = ? 
        WHERE id_horario = ? AND tenant_id = ?
        ;`
        const [rows] = await pool.query(query, [date, schedule.hora_inicio, schedule.hora_fin, id_schedule, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('UPDATE', 'horarios_disponibles', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}

export async function deleteSchedule(id_schedule, tenant_id) {
    try {
        const query = `DELETE FROM horarios_disponibles WHERE id_horario = ? AND tenant_id = ?;`
        const [rows] = await pool.query(query, [id_schedule, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('DELETE', 'horarios_disponibles', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}