var express = require('express')
var router = express.Router()
var reportsController = require('../controllers/ReportsController')

router.post('/build', reportsController.buildReport)
router.post('/export', reportsController.exportReport)

module.exports = router