import express, { request, response } from "express";
import { createSpeciality, getSpecialities, updateSpeciality } from "../db/routes/specialities.js";
const router = express.Router()

//Las rutas siempre empiezan con / porque en el archivo de server ya estan declaradas como /specialities

//Toods las especialidades
router.get('/:id', async (request, response) => {
    const tenant_id = Number(request.params.tenant_id)
    if (!tenant_id) {
        return response.status(400).json({ 'message': 'El tenant id es requerido' })
    }
    try {
        const specialities = await getSpecialities(tenant_id)
        if (specialities.success) {
            if (!specialities.length) {
                return response.status(200).json({ specialities: [] })
            }

            return response.status(200).json({ specialities: specialities })
        } else {
            return response.status(500)
        }
    } catch (e) {
        return response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})

router.post('/', async (request, response) => {
    const { name, description, tenant_id } = request.body

    if (!tenant_id || !name || !description) {
        return response.status(400).json({ 'message': 'Todos los datos son requeridos' })
    }

    try {
        const inserted = await createSpeciality(name, description, tenant_id)
        if (inserted.success) {
            return response.status(200)
        } else {
            return response.status(500)
        }
    } catch (e) {
        return response.status(500)
    }
})

router.patch('/', async (request, response) => {
    const { id_speciality, name, description, tenant_id } = request.body

    if (!id_speciality || !name || !description || !tenant_id) {
        return response.status(400)
    }

    try {
        const updated = await updateSpeciality(id_speciality, name, description, tenant_id)
        if (updated.success) {
            return response.status(200)
        } else {
            return response.status(500)
        }
    } catch (e) {
        return response.status(500)
    }
})

router.delete('/:id/:tenant_id', async (request, response) => {
    const id_speciality = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)

    if (!tenant_id || !id_speciality) {
        return response.status(400)
    }

    try {
        const deleted = await deleteSchedule(id_speciality, tenant_id)
        if (deleted.success) {
            return response.status(201)
        } else {
            return response.status(500)
        }
    } catch (e) {
        return response.status(500)
    }
})

export default router