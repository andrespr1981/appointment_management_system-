import express from "express";
import { getSpecialists, getSpecialistData, getSpecialistsBySpeciality, deleteSpecialist, updateSpecialist } from "../db/routes/specialists.js";
const router = express.Router()

//Las rutas siempre empiezan con / porque en el archivo de server ya estan declaradas como /specialists

//Toods los especialistas
router.get('/:id', async (request, response) => {
    const tenant_id = Number(request.params.id)
    if (!tenant_id) {
        return response.status(400).json({ success: false })
    }
    try {
        const specialists = await getSpecialists(tenant_id)
        if (specialists.success) {
            if (!specialists.specialists.length) {
                return response.status(200).json({ 'specialists': [] })
            }
            return response.status(200).json({ specialists: specialists.specialists })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

//Especialistas filtrados por especialidad
router.get('/bySpeciality/:id/:tenant_id', async (request, response) => {
    const id_speciality = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)
    if (!tenant_id || !id_speciality) {
        return response.status(400).json({ success: false })
    }
    try {
        const specialists = await getSpecialistsBySpeciality(id_speciality, tenant_id)
        if (specialists.success) {
            if (!specialists.specialists.length) {
                return response.status(200).json({ 'specialists': [] })
            }
            return response.status(200).json({ specialists: specialists.specialists })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.get('/by_id_specialist/:id/:tenant_id', async (request, response) => {
    const id_specialist = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)
    if (!tenant_id || !id_specialist) {
        return response.status(400).json({ success: false })
    }

    try {
        const specialist_data = await getSpecialistData(id_specialist, tenant_id)
        if (specialist_data.success) {
            if (!specialist_data.specialist_data.length) {
                return response.status(200).json({ 'specialist_data': [] })
            }
            return response.status(200).json({ specialist_data: specialist_data.specialist_data })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.patch('/', async (request, response) => {
    const { id_specialist, cedula, price, tenant_id } = request.body

    if (!id_specialist || !cedula || !price || !tenant_id) {
        return response.status(400).json({ success: false })
    }

    try {
        const updated = await updateSpecialist(id_specialist, cedula, price, tenant_id)
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
    const id_specialist = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)

    if (!tenant_id || !id_specialist) {
        return response.status(400).json({ success: false })
    }

    try {
        const deleted = await deleteSpecialist(id_specialist, tenant_id)
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