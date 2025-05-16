import express from "express";

const router = express.Router()

// contacts

router.post('/', (req, res) => {
    res.status(201).send('posted')
})
// get contacts
router.get('/', (req, res) => {
    res.status(200).send('success')
})
// delete contacts
router.delete('/', (req, res) => { 
    res.status(200).send('deleted')
})

export default router
