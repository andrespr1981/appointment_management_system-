import express from "express";
const router = express.Router()

router.get('/', (request, response) => {
    const id = Number(request.params.id)
})

router.get('/:id', (request, response) => {
    const id = Number(request.params.id)
})

export default router


