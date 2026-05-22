import express from "express";
import { getRoles, createRol, updateRol, deleteRol } from "../db/routes/roles.js";

const router = express.Router()

router.get('/:id', async (request, response) => {
    const tenant_id = Number(request.params.id)

    if (!tenant_id) {
        return response.status(400).json({ success: false })
    }

    try {
        const roles = await getRoles(tenant_id)
        if (roles.success) {
            return response.status(200).json({ 'roles': roles.roles })
        } else {
            return response.status(500).json({ success: false })
        }
    } catch (e) {
        return response.status(500).json({ success: false })
    }
})

router.post('/', async (request, response) => {
    const { name, tenant_id } = request.body

    if (!name || !tenant_id) {
        return response.status(400).json({ success: false })
    }

    try {
        const inserted = await createRol(name, tenant_id)
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
    const { id_rol, name, tenant_id } = request.body

    if (!tenant_id || !id_rol) {
        return response.status(400).json({ success: false })
    }

    try {
        const updated = await updateRol(id_rol, name, tenant_id)
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
    const id_rol = Number(request.params.id)
    const tenant_id = Number(request.params.tenant_id)

    if (!tenant_id || !id_rol) {
        return response.status(400).json({ success: false })
    }

    try {
        const deleted = await deleteRol(id_rol, tenant_id)
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