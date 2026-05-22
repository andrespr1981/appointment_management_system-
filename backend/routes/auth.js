import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router()
import { UAParser } from 'ua-parser-js';
import { verifyRefreshToken } from "../db/routes/refresh_tokens.js";

router.post('/verify_refresh', async (request, response) => {
    const refreshToken = request.cookies.refreshToken
    let { browser } = UAParser(request.headers['user-agent']);
    if (!refreshToken) {
        return response.status(400).json({ message: 'No hay token' })
    }
    if (!verifyRefreshToken(refreshToken, browser.name)) {
        return response.status(401).json({ message: 'El token no es correcto' })
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_JWT_KEY);
        const accessToken = jwt.sign({
            'id_usuario': decoded.id_usuario,
            'role': decoded.role,
            'tenant_id': decoded.tenant_id
        }, process.env.ACCESS_SECRET_JWT_KEY, { expiresIn: '15m' })
        return response.status(200).json({
            success: true,
            accessToken: accessToken,
        });
    } catch (e) {
        return response.status(409).json({ message: "Refresh token inválido o expirado" });
    }
})

export function middleAcessToken(request, response, next) {
    const header = request.headers["authorization"];
    const accessToken = header && header.split(" ")[1];

    if (!accessToken) {
        return response.status(400).json({ success: false })
    }

    try {
        jwt.verify(accessToken, process.env.ACCESS_SECRET_JWT_KEY, (e, decoded) => {
            if (e) {
                return response.status(401).json({ success: false })
            }
            request.user = decoded
            next()
        })
    } catch (e) {
        return response.status(409).json({ success: false })
    }
}

export default router
