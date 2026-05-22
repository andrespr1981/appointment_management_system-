import { createNewSchedule, deleteSchedule, getScheduleBySpecialist, updateSchedule } from "../db/routes/schedules.js"
import express from "express";
const router = express.Router()

router.get('/:id/:tenant_id', async (request, response) => {
    const id_specialist = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)

    if (!id_specialist || !tenant_id) {
        return response.status(400).json({ success: false })
    }
    try {
        const schedule = await getScheduleBySpecialist(id_specialist, tenant_id)
        if (schedule.success) {
            return response.status(200).json({ 'schedule': schedule.schedules })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.post('/', async (request, response) => {
    const { id_specialist, date, schedule, tenant_id } = request.body

    if (!id_specialist || !tenant_id || !date || !schedule) {
        return response.status(400).json({ success: false })
    }

    try {
        const inserted = await createNewSchedule(id_specialist, date, schedule, tenant_id)
        if (inserted.success) {
            return response.status(201).json({ success: true })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.patch('/', async (request, response) => {
    const { id_schedule, date, schedule, tenant_id } = request.body

    if (!id_schedule || !tenant_id || !date || !schedule) {
        return response.status(400).json({ success: false })
    }

    try {
        const updated = await updateSchedule(id_schedule, date, schedule, tenant_id)
        if (updated.success) {
            return response.status(200).json({ success: true })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.delete('/:id/:tenant_id', async (request, response) => {
    const id_schedule = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)

    if (!tenant_id || !id_schedule) {
        return response.status(400).json({ success: false })
    }

    try {
        const deleted = await deleteSchedule(id_schedule, tenant_id)
        if (deleted.success) {
            return response.status(200).json({ success: true })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

export default router