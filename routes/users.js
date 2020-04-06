var express = require('express')
var router = express.Router()
var authController = require('../controllers/AuthController')
var usersController = require('../controllers/UsersController')

router.get('/:email', authController.APIKey, usersController.get)
router.post('/add', authController.APIKey, usersController.add)
router.post('/search', authController.APIKey, usersController.search)
router.delete('/:email', authController.APIKey, usersController.delete)
router.patch('/:email/update', authController.APIKey, usersController.update)

module.exports = router