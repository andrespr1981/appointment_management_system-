import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserData } from '../db/routes/login.js'
import { UAParser } from 'ua-parser-js';
import { insertRefreshToken, revokeRefreshToken } from "../db/routes/refresh_tokens.js";
import { isString } from '../routes/utils/verify_string.js'
import { isNumber } from '../routes/utils/verify_number.js'
import { registerUserLogin } from "../db/db.js";
const router = express.Router()

router.post('/', async (request, response) => {
    const { email, password, tenant_id } = request.body

    if (!email || !password || !tenant_id || !email.includes('@') || !isString(email) || !isString(password)) {
        return response.status(400).json({ success: false })
    }

    let { browser } = UAParser(request.headers['user-agent']);

    try {
        const userData = await getUserData(email, tenant_id)
        if (!userData) {
            return response.status(404).json({ success: false })
        }

        bcrypt.compare(password, userData.password_hash, (e, result) => {
            if (e) {
                await registerUserLogin(userData.id_usuario, email, false, browser.name, tenant_id)
                return response.status(401).json({ success: false })
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
        await registerUserLogin(userData.id_usuario, email, true, browser.name, tenant_id)
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
        response.status(500).json({ success: false })
    }

})

export default router