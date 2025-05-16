import express from "express";

const router = express.Router();

//get all jop announcement
router.get('/', (req, res) => {
    res.status(200).send('success')
})

// create jop
router.post('/', (req, res) =>{ 
res.status(201).send('student created')
})

// update jop info

router.put('/', (req, res) => {
    res.status(200).send('info updated')
})

// delete jop

router.delete('/', (req, res) => {
    res.status(200).send('student deleted')
})

export default router;