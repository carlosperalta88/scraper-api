var express = require('express')
var router = express.Router()
var reportsController = require('../controllers/ReportsController')

router.post('/build-report', reportsController.buildReport)

module.exports = router