require('dotenv').config()
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const appointmentsRouter = require('./routes/appointmens')
const app = express()

// fetch desde frontend http://localhost:5000/login

//Lista de direcciones que pueden acceder al backend
app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use(express.json())
app.use(cookieParser())

// Se importa las rutas de las citas
app.use('appointmens', appointmentsRouter)

app.get('/', (request, response) => {
    response.send('test route')
})

app.get('/register', (request, response) => {
    const { name, email } = request.body
    response.json({ message: 'Hello from the backend' })
})

app.get('/login', (request, response) => {
    const { email, password } = request.body
    const token = jwt.sign({ email: email }, process.env.SECRET_JWT_KEY, { expiresIn: '1h' })
    response.cookie('access_token', token, { httpOnly: true, sameSite: true })
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