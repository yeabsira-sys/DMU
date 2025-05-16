import express from "express";

const router = express.Router();

//get all students
router.get('/', (req, res) => {
    res.status(200).send('success')
})

// create student
router.post('/', (req, res) =>{ 
res.status(201).send('student created')
})

// update student info

router.put('/', (req, res) => {
    res.status(200).send('info updated')
})

// delete student

router.delete('/', (req, res) => {
    res.status(200).send('student deleted')
})

export default router;