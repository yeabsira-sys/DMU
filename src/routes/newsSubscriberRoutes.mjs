import express from 'express'

const router = express.Router()

// subscribe for news

router.post('/', (req, res) => {
    res.status(201).send('subscribed')
})

// unsubscribe from news notification

router.delete('/', (req, res) => {
    res.status(200). send('unsubscribed')
})

export default router