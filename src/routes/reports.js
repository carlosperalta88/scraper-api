const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const reportsController = require('../controllers/ReportsController')

router.post('/build', authController.APIKey, reportsController.buildReport)
router.post('/export', authController.APIKey, reportsController.exportReport)

module.exports = router
