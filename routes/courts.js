var express = require('express')
var router = express.Router()
var courtsController = require('../controllers/CourtsController')

router.post('/addMany', courtsController.addCourts)
router.post('/add', courtsController.addCourt)
router.get('/:id', courtsController.getCourt)

module.exports = router