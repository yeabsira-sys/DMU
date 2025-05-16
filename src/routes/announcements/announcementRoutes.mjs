import express from "express";

const router = express.Router();

//get all announcement
router.get('/', (req, res) => {
    res.status(200).send('success')
})

// create announcement
router.post('/', (req, res) =>{ 
res.status(201).send('student created')
})

// update announcement info

router.put('/', (req, res) => {
    res.status(200).send('info updated')
})

// delete announcement

router.delete('/', (req, res) => {
    res.status(200).send('student deleted')
})

export default router;