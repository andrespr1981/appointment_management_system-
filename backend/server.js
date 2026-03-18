import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import rateLimit from 'express-rate-limit';
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import appointmentsRouter from "./routes/appointmens.js";
import specialistsRouter from "./routes/specialists.js";
import specialitiesRouter from "./routes/specialities.js"

import { getUserData } from './db/passwords.js'
import { isAlreadyRegister, registerUser } from "./db/register.js";
// Comando para ejecutar el backend: node server.js
// fetch desde frontend http://localhost:5000/login

const app = express();
//Limitador de solicitudes por ip
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { 'message': 'Demaciadas solicitudes' }
})

//Lista de direcciones que pueden acceder al backend
app.use(cors({
    origin: ['http://localhost:3000']
}))
app.use(limiter)
app.use(express.json())
app.use(cookieParser())
// Se importa las rutas de las citas
app.use('/appointmens', appointmentsRouter)
app.use('/specialists', specialistsRouter)
app.use('/specialities', specialitiesRouter)

app.get('/', (request, response) => {
    response.send('test route')
})

app.post('/register', async (request, response) => {
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

app.post('/login', async (request, response) => {
    const { email, password } = request.body
    if (!email || !password) {
        return response.status(400).json({ 'message': 'Correo y contraseña son requeridos' })
    }
    try {
        const userData = await getUserData(email)
        if (!dbPassword) {
            return response.status(404).json({ 'message': 'Usuario no encontrado' })
        }

        bcrypt.compare(password, userData.password_hash, (e, result) => {
            if (e) {
                return response.status(401).json({ 'message': 'La contraseña es incorrecta' })
            }
            if (result) {
                const accessToken = jwt.sign({ userID: id_usuario }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
                const refreshToken = jwt.sign({ userID: id_usuario }, process.env.REFRESH_SECRET_JWT_KEY, { expiresIn: '30d' })
                response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: true, maxAge: 24 * 60 * 60 * 1000 })
                response.status(200).json({
                    accessToken: accessToken,
                    'name': 'Andres',
                    'role': 'Paciente'
                })
            }
        })
    } catch (e) {
        response.status(500).json({ 'message': 'Error en la base de datos' })
    }

})

app.post('logout', (request, response) => {
    response.clearCookie('access_token')
})

app.get('/protected', (request, response) => {
    const token = request.cookie.access_token
})

app.listen(5000, () => {
    console.log('server is active')
})