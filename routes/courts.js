var express = require('express')
var router = express.Router()
var courtsController = require('../controllers/CourtsController')

router.post('/add', courtsController.addCourts)
router.post('/', courtsController.getCourts)

module.exports = router