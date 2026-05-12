import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAlreadyRegister, registerUser } from "../db/routes/register.js";
import { insertRefreshToken } from "../db/routes/refresh_tokens.js";
import { UAParser } from 'ua-parser-js';
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
        let { browser } = UAParser(request.headers['user-agent']);
        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = await registerUser(name, lastName, email, tel, hashedPassword)
        const accessToken = jwt.sign({
            'id_usuario': userData.id_usuario,
            'role': 'Paciente'
        }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ 'id_usuario': userData.id_usuario }, process.env.REFRESH_SECRET_JWT_KEY, { expiresIn: '30d' })
        const inserted = await insertRefreshToken(1, refreshToken, userData.id_usuario, browser.name)
        if (!inserted) {
            throw Error
        }
        response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        response.status(200).json({
            accessToken: accessToken,
            'id_usuario': userData.id_usuario,
            'name': name,
            'role': 'Paciente'
        })
        return;
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
        return;
    }
})

export default router