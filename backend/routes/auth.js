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
        return response.status(401).json({ message: 'No hay token' })
    }
    return response.status(200).json({ sucess: true })
})

router.post('/access', async (request, response) => {
    const refreshToken = request.cookies.refreshToken
    if (!verifyRefreshToken(refreshToken,)) {
        return response.status(401).json({ message: 'No hay token' })
    }
    if (!refreshToken) {
        return response.status(401).json({ message: 'No hay token' })
    }
    return response.status(200).json({ sucess: true })
})

export default router
