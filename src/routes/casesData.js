const express = require('express')
const router = express.Router()
const casesDataController = require('../controllers/CasesDataController')

router.post('/add/:role', casesDataController.add)

module.exports = router

