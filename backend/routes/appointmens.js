import express from "express";
const router = express.Router()

router.get('/', (request, response) => {
    const id = Number(request.params.id)
})

router.post('/', (request, response) => {
    const { id_especialista, id_usuario, date, time, reason } = request.body

})

export default router


