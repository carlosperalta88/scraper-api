var express = require('express')
var router = express.Router()
var authController = require('../controllers/AuthController')
var courtsController = require('../controllers/CourtsController')

router.post('/add', authController.APIKey, courtsController.addCourts)
router.post('/', courtsController.getCourts)

module.exports = router