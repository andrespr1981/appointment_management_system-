import express, { request, response } from "express";
import { createSpeciality, deleteSpeciality, getSpecialities, updateSpeciality } from "../db/routes/specialities.js";
const router = express.Router()

//Las rutas siempre empiezan con / porque en el archivo de server ya estan declaradas como /specialities

//Toods las especialidades
router.get('/:id', async (request, response) => {
    const tenant_id = Number(request.params.id)
    if (!tenant_id) {
        return response.status(400).json({ success: false })
    }
    try {
        const specialities = await getSpecialities(tenant_id)
        if (specialities.success) {
            if (!specialities.specialities.length) {
                return response.status(200).json({ specialities: [] })
            }

            return response.status(200).json({ specialities: specialities.specialities })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.post('/', async (request, response) => {
    const { name, description, tenant_id } = request.body

    if (!tenant_id || !name || !description) {
        return response.status(400).json({ success: false })
    }

    try {
        const inserted = await createSpeciality(name, description, tenant_id)
        if (inserted.success) {
            return response.status(200).json({ success: true })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.patch('/', async (request, response) => {
    const { id_speciality, name, description, tenant_id } = request.body

    if (!id_speciality || !name || !description || !tenant_id) {
        return response.status(400).json({ success: false })
    }

    try {
        const updated = await updateSpeciality(id_speciality, name, description, tenant_id)
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
    const id_speciality = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)

    if (!tenant_id || !id_speciality) {
        return response.status(400).json({ success: false })
    }

    try {
        const deleted = await deleteSpeciality(id_speciality, tenant_id)
        if (deleted.success) {
            return response.status(201).json({ success: true })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

export default router