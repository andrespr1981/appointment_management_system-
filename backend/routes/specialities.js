import express from "express";
import { getSpecialities } from "../db/routes/specialities.js";
const router = express.Router()

//Las rutas siempre empiezan con / porque en el archivo de server ya estan declaradas como /specialities

//Toods las especialidades
router.get('/', async (request, response) => {
    try {
        const specialities = await getSpecialities()
        if (!specialities.length) {
            return response.status(200).json({ specialities: [] })
        }
        return response.status(200).json({ specialities: specialities })
    } catch (e) {
        return response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})

export default router