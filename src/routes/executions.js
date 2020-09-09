const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const executionsController = require('../controllers/ExecutionsController')

router.post('/', authController.APIKey, executionsController.create)
router.get('/:id', authController.APIKey, executionsController.get)
router.get('/:id/start', authController.APIKey, executionsController.start)
router.patch('/:id', authController.APIKey, executionsController.edit)
router.get('/:id/check', authController.APIKey, executionsController.getChanges)

module.exports = router

