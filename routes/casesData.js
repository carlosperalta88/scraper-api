var express = require('express')
var router = express.Router()
var casesDataController = require('../controllers/CasesDataController')

router.post('/add/:role', casesDataController.add)

module.exports = router

