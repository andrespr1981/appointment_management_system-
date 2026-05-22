import express from "express";
import { createAppointment, deleteAppointment, getAppoinmentsByUser } from "../db/routes/appointments.js";
const router = express.Router()

router.get('/:id/:tenant_id', async (request, response) => {
    const userId = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)
    if (!userId || !tenant_id) {
        return response.status(400).json({ success: false })
    }
    try {
        const appointments = await getAppoinmentsByUser(userId)
        if (appointments.success) {
            return response.status(200).json({ apointments: appointments.appointments })
        } else {
            response.status(500).json({ success: false })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ success: false })
    }
})

router.post('/', async (request, response) => {
    const { userId, specialistId, date, time, reason, tenant_id } = request.body
    if (!specialistId || !userId || !date || !time || !reason || tenant_id) {
        return response.status(400).json({ success: false })
    }
    try {
        const result = await createAppointment(userId, specialistId, date, time, reason, tenant_id)
        if (result.sucess) {
            return response.status(200).json({ apointmentId: result.apointmentId })
        } else {
            response.status(500).json({ success: false })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ success: false })
    }
})

router.delete('/:id/:tenant_id', async (request, response) => {
    const apointmentId = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)
    if (!apointmentId || !tenant_id) {
        return response.status(400).json({ success: false })
    }
    try {
        const result = await deleteAppointment(apointmentId)
        if (result.sucess) {
            return response.status(200).json({ apointmentId: result.apointmentId })
        } else {
            response.status(500).json({ success: false })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({ success: false })
    }
})


router.put('/id', (request, response) => {
})



export default router


