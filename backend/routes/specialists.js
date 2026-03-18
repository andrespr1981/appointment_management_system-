import express from "express";
import { getSpecialists } from "../db/specialists.js";
const router = express.Router()

//Las rutas siempre empiezan con / porque en el archivo de server ya estan declaradas como /specialists

//Toods los especialistas
router.get('/', async (request, response) => {
    try {
        const specialists = await getSpecialists()
        if (!specialists.length) {
            return response.status(200).json({ 'specialists': [] })
        }
        return response.status(200).json({ specialists: specialists })
    } catch (e) {
        return response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})

//Especialistas filtrados por especialidad
router.get('/:speciality', async (request, response) => {
    const specialityID = Number(request.params.id)
    try {
        const specialists = await getSpecialistsBySpeciality(specialityID)
        if (!specialists.length) {
            return response.status(200).json({ 'specialists': [] })
        }
        return response.status(200).json({ specialists: specialists })
    } catch (e) {
        return response.status(500).json({ 'message': 'Error en la base de datos' })
    }

})

export default router