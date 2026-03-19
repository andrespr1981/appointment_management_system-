import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserData } from '../db/routes/passwords.js'
const router = express.Router()

router.post('/', async (request, response) => {
    const { email, password } = request.body
    if (!email || !password) {
        return response.status(400).json({ 'message': 'Correo y contraseña son requeridos' })
    }
    try {
        const userData = await getUserData(email)
        if (!userData) {
            return response.status(404).json({ 'message': 'Usuario no encontrado' })
        }

        bcrypt.compare(password, userData.password_hash, (e, result) => {
            if (e) {
                return response.status(401).json({ 'message': 'La contraseña es incorrecta' })
            }
            if (result) {
                const accessToken = jwt.sign({ userID: userData.id_usuario }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
                const refreshToken = jwt.sign({ userID: userData.id_usuario }, process.env.REFRESH_SECRET_JWT_KEY, { expiresIn: '30d' })
                response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: true, maxAge: 24 * 60 * 60 * 1000 })
                response.status(200).json({
                    accessToken: accessToken,
                    'name': 'Andres',
                    'role': 'Paciente'
                })
            }
        })
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }

})

export default router