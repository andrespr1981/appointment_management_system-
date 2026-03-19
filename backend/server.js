import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import rateLimit from 'express-rate-limit';
import express from "express";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
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
    origin: ['http://localhost:3000']
}))
app.use(limiter)
app.use(express.json())
app.use(cookieParser())

// Se importa las rutas de las citas
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/appointmens', appointmentsRouter)
app.use('/specialists', specialistsRouter)
app.use('/specialities', specialitiesRouter)

app.get('/', (request, response) => {
    response.send('test route')
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