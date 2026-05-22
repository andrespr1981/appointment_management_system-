import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import rateLimit from 'express-rate-limit';
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js"
import { middleAcessToken } from "./routes/auth.js"
import rolesRouter from "./routes/roles.js"
import loginRouter from "./routes/login.js";
import logoutRouter from "./routes/logout.js";
import registerRouter from "./routes/register.js";
import shedulesRouter from './routes/schedules.js';
import appointmentsRouter from "./routes/appointmens.js";
import specialistsRouter from "./routes/specialists.js";
import specialitiesRouter from "./routes/specialities.js"

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
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(limiter)
app.use(express.json())
app.use(cookieParser())

// Se importa las rutas 
app.use('/auth', authRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/register', registerRouter)
app.use('/roles', middleAcessToken, rolesRouter)
app.use('/schedules', middleAcessToken, shedulesRouter)
app.use('/specialists', middleAcessToken, specialistsRouter)
//Faltar probar appointemnts, y confirmar que si modificaron filas en la base archivo specialities db
app.use('/appointmens', middleAcessToken, appointmentsRouter)
app.use('/specialities', middleAcessToken, specialitiesRouter)

app.post('/test', (request, response) => {
    let { browser } = UAParser(request.headers['user-agent']);
    console.log(browser)
    response.send('test route')
})

app.listen(5000, () => {
    console.log('server is active')
})