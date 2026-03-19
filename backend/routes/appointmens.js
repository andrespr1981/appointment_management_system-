import express from "express";
import { createAppointment, deleteAppointment, getAppoinmentsByUser } from "../db/routes/appointments.js";
const router = express.Router()

router.get('/:id', async (request, response) => {
    const userId = Number(request.params.id)
    if (!userId) {
        return response.status(400).json({ 'message': 'El id del usuario es requerido' })
    }
    try {
        const appointments = await getAppoinmentsByUser(userId)
        if (appointments.success) {
            return response.status(200).json({ apointments: appointments.appointments })
        } else {
            response.status(500).json({ 'message': 'Error en la base de datos' })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})

router.post('/', async (request, response) => {
    const { userId, specialistId, date, time, reason } = request.body
    if (!specialistId || !userId || !date || !time || !reason) {
        return response.status(400).json({ 'message': 'Todos los datos son requeridos' })
    }
    try {
        const result = await createAppointment(userId, specialistId, date, time, reason)
        if (result.sucess) {
            return response.status(200).json({ apointmentId: result.apointmentId })
        } else {
            response.status(500).json({ 'message': 'Error en la base de datos' })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})

router.delete('/id', async (request, response) => {
    const apointmentId = Number(request.params.id)
    if (!apointmentId) {
        return response.status(400).json({ 'message': 'El id de la cita es requerido' })
    }
    try {
        const result = await deleteAppointment(apointmentId)
        if (result.sucess) {
            return response.status(200).json({ apointmentId: result.apointmentId })
        } else {
            response.status(500).json({ 'message': 'Error en la base de datos' })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})


router.put('/id', (request, response) => {
})



export default router


