const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const courtsController = require('../controllers/CourtsController')

router.post('/add', authController.APIKey, courtsController.addCourts)
router.post('/', courtsController.getCourts)

module.exports = router
