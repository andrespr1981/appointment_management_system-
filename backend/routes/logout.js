import { UAParser } from 'ua-parser-js';
import express from "express";
const router = express.Router()

router.delete('/', (request, response) => {
    const { id_user, tenant_id } = request.body
    let { browser } = UAParser(request.headers['user-agent']);
    const revoke = revokeRefreshToken(id_user, browser.name, tenant_id)
    response.clearCookie('refresh_token')
})

export default router