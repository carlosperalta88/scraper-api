var express = require('express')
var router = express.Router()
var authController = require('../controllers/AuthController')
var reportsController = require('../controllers/ReportsController')

router.post('/build', authController.APIKey, reportsController.buildReport)
router.post('/export', authController.APIKey, reportsController.exportReport)

module.exports = router