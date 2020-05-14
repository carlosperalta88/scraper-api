var express = require('express')
var router = express.Router()
var executionsController = require('../controllers/executionsController')
var authController = require('../controllers/AuthController')

router.post('/', authController.APIKey, executionsController.create)
router.get('/:id', authController.APIKey, executionsController.get)
router.get('/:id/start', authController.APIKey, executionsController.start)
router.patch('/:id', authController.APIKey, executionsController.edit)

module.exports = router

