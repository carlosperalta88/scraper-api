var express = require('express')
var router = express.Router()
var authController = require('../controllers/AuthController')
var clientsController = require('../controllers/ClientsController')

router.get('/:external_id', authController.APIKey, clientsController.get)
router.post('/add', authController.APIKey, clientsController.add)
router.post('/search', authController.APIKey, clientsController.search)
router.delete('/:external_id', authController.APIKey, clientsController.delete)
router.patch('/:external_id/update', authController.APIKey, clientsController.update)

module.exports = router