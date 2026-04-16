import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router()
import { getRefreshToken } from "../db/routes/refresh_tokens.js";

router.post('/refresh', async (request, response) => {
    const refreshToken = request.cookies.refreshToken
    if (!refreshToken) {
        return response.status(401).json({ message: 'No hay token' })
    }
    return response.status(200).json({ sucess: true })
})

router.post('/access', async (request, response) => {
    const refreshToken = request.cookies.refreshToken
    console.log(refreshToken)
    if (!refreshToken) {
        return res.status(401).json({ message: 'No hay token' })
    }
})

export default router
