import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAlreadyRegister, registerUser } from "../db/routes/register.js";
const router = express.Router()

router.post('/', async (request, response) => {
    const { name, lastName, email, tel, password } = request.body
    if (!name || !lastName || !email || !tel || !password) {
        return response.status(400).json({ 'message': 'Todos los datos son requeridos' })
    }
    try {
        if (await isAlreadyRegister(email)) {
            return response.status(409).json({ 'message': 'El correo ya se encuentra registrado' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const id = await registerUser(name, lastName, email, tel, hashedPassword)
        return response.status(201).json({ id: id, name: name, email: email })
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }
})

export default router