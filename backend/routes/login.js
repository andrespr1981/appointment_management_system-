import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserData } from '../db/routes/passwords.js'
import { UAParser } from 'ua-parser-js';
import { insertRefreshToken } from "../db/routes/refresh_tokens.js";
const router = express.Router()

router.post('/', async (request, response) => {
    const { email, password } = request.body
    let { browser } = UAParser(request.headers['user-agent']);

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
        })
        const accessToken = jwt.sign({
            'id_usuario': userData.id_usuario,
            'role': userData.id_rol
        }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ 'id_usuario': userData.id_usuario }, process.env.REFRESH_SECRET_JWT_KEY, { expiresIn: '30d' })
        const inserted = await insertRefreshToken(1, refreshToken, userData.id_usuario, browser.name);
        if (!inserted) {
            throw new Error('No se pudo insertar el refresh token');
        }
        response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        response.status(200).json({
            accessToken: accessToken,
            role: 'Paciente'
        })
        return;
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }

})

export default router