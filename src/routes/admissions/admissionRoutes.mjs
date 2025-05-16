import express from "express";

const router = express.Router();

//get all admission
router.get('/', (req, res) => {
    res.status(200).send('success')
})

// create admission
router.post('/', (req, res) =>{ 
res.status(201).send('student created')
})

// update admission info

router.put('/', (req, res) => {
    res.status(200).send('info updated')
})

// delete admission

router.delete('/', (req, res) => {
    res.status(200).send('student deleted')
})

export default router;