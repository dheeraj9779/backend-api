const express = require('express');
const router = express.Router();


router.use(function logger (req, res, next) {
    console.log('other logged on: ',new Date().toLocaleString())
    next()
})


router.get('/', (req, res) => {
    res.send("Hello from the other route")
})

router.get('/iam', (req, res) => {
    res.send("Hello from other")
})

router.post('/upload', (req, res) => {
    console.log(req.files)
    res.send("Hello from other")
})

module.exports = router