import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserData } from '../db/routes/login.js'
import { UAParser } from 'ua-parser-js';
import { insertRefreshToken, revokeRefreshToken } from "../db/routes/refresh_tokens.js";
import { isString } from '../routes/utils/verify_string.js'
import { isNumber } from '../routes/utils/verify_number.js'
const router = express.Router()

router.post('/', async (request, response) => {
    const { email, password, tenant_id } = request.body

    if (!email || !password) {
        return response.status(400).json({ 'message': 'Correo y contraseña son requeridos' })
    }

    if (!tenant_id) {
        return response.status(400).json({ 'message': 'Tenant id es requerido' })
    }

    if (!email.includes('@') || !isString(email)) {
        return response.status(400).json({ 'message': 'Correo no es valido' })
    }

    if (!isString(password)) {
        return response.status(400).json({ 'message': 'La contraseña debe de ser una cadena de texto' })
    }

    let { browser } = UAParser(request.headers['user-agent']);

    try {
        const userData = await getUserData(email, tenant_id)
        if (!userData) {
            return response.status(404).json({ 'message': 'Usuario no encontrado' })
        }

        bcrypt.compare(password, userData.password_hash, (e, result) => {
            if (e) {
                return response.status(401).json({ 'message': 'La contraseña es incorrecta' })
            }
        })
        const revoke = revokeRefreshToken(userData.id_usuario, browser.name, tenant_id)
        const accessToken = jwt.sign({
            'id_usuario': userData.id_usuario,
            'role': userData.id_rol,
            'tenant_id': tenant_id
        }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ 'id_usuario': userData.id_usuario, 'role': 'Paciente', 'tenant_id': tenant_id }, process.env.REFRESH_SECRET_JWT_KEY, { expiresIn: '30d' })
        const inserted = await insertRefreshToken(refreshToken, userData.id_usuario, browser.name, tenant_id);
        if (!inserted) {
            throw new Error('No se pudo insertar el refresh token');
        }
        response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        response.status(200).json({
            'accessToken': accessToken,
            'id_usuario': userData.id_usuario,
            'role': 'Paciente',
            'tenant_id': tenant_id
        })
        return;
    } catch (e) {
        console.log(e)
        // Solo mandar mensaje de
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }

})

export default router