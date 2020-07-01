const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const clientsController = require('../controllers/ClientsController')

router.get('/:external_id', authController.APIKey, clientsController.get)
router.post('/add', authController.APIKey, clientsController.add)
router.post('/search', authController.APIKey, clientsController.search)
router.delete('/:external_id', authController.APIKey, clientsController.delete)
router.patch('/:external_id/update',
    authController.APIKey, clientsController.update)

module.exports = router
