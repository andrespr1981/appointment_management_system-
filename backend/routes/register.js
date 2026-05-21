import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAlreadyRegister, registerUser } from "../db/routes/register.js";
import { insertRefreshToken } from "../db/routes/refresh_tokens.js";
import { UAParser } from 'ua-parser-js';
import { isString } from '../routes/utils/verify_string.js'
import { isNumber } from '../routes/utils/verify_number.js'
const router = express.Router()

router.post('/', async (request, response) => {
    const { name, lastName, email, tel, password, tenant_id } = request.body
    const values = [name, lastName, email, tel, password]
    if (!name || !lastName || !email || !tel || !password) {
        return response.status(400).json({ 'message': 'Todos los datos son requeridos' })
    }

    if (!tenant_id) {
        return response.status(400).json({ 'message': 'Tenant id es requerido' })
    }

    for (const valor of values) {
        if (!isString(valor)) {
            return response.status(400).json({ 'message': `El campo ${valor} tiene que ser string` })
        }
    }

    try {
        if (await isAlreadyRegister(email)) {
            return response.status(409).json({ 'message': 'El correo ya se encuentra registrado' })
        }
        let { browser } = UAParser(request.headers['user-agent']);
        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = await registerUser(name, lastName, email, tel, hashedPassword, tenant_id)
        if (!userData.success || !userData.id_usuario) {
            throw new Error('No se pudo registrar el usuario correctamente')
        }
        //Agregar cuando se logeo el usuario
        //Agregar cuando se pidieron cosas a la base de datos
        //Agregar un valor secreto en los procedures, seguridad
        const accessToken = jwt.sign({
            'id_usuario': userData.id_usuario,
            'role': 'Paciente',
            'tenant_id': tenant_id
        }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ 'id_usuario': userData.id_usuario, 'role': 'Paciente', 'tenant_id': tenant_id }, process.env.REFRESH_SECRET_JWT_KEY, { expiresIn: '30d' })
        const inserted = await insertRefreshToken(refreshToken, userData.id_usuario, browser.name, tenant_id)
        if (!inserted) {
            throw Error
        }
        response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        response.status(200).json({
            'accessToken': accessToken,
            'id_usuario': userData.id_usuario,
            'role': 'Paciente',
            'tenant_id': tenant_id,
        })
        return;
    } catch (e) {
        console.log(e)
        response.status(500).json({ 'message': 'Error en la base de datos' })
        return;
    }
})

export default router