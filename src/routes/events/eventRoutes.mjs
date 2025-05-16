import express from "express";

const router = express.Router();

//get all event
router.get('/', (req, res) => {
    res.status(200).send('success')
})

// create event
router.post('/', (req, res) =>{ 
res.status(201).send('student created')
})

// update event info

router.put('/', (req, res) => {
    res.status(200).send('info updated')
})

// delete event

router.delete('/', (req, res) => {
    res.status(200).send('student deleted')
})

export default router;