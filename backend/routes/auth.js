import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router()
import { UAParser } from 'ua-parser-js';
import { verifyRefreshToken } from "../db/routes/refresh_tokens.js";

router.post('/verify_refresh', async (request, response) => {
    const refreshToken = request.cookies.refreshToken
    let { browser } = UAParser(request.headers['user-agent']);
    if (!refreshToken) {
        return response.status(401).json({ message: 'No hay token' })
    }
    if (!verifyRefreshToken(refreshToken, browser.name)) {
        return response.status(401).json({ message: 'El token no es correcto' })
    }
    return response.status(200).json({ sucess: true })
})

router.post('/access', async (request, response) => {
    const { access_token } = request.body
    if (!access_token) {
        return response.status(401).json({ message: 'No hay acess token' })
    }
    try {
        jwt.verify(access_token, process.env.ACCESS_SECRET_JWT_KEY)
        return response.status(200).json({ sucess: true })
    } catch (e) {
        return response.status(403).json({ success: false });
    }
})

export default router
