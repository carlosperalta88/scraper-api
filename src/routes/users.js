const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const usersController = require('../controllers/UsersController')

router.get('/:email', authController.APIKey, usersController.get)
router.post('/add', authController.APIKey, usersController.add)
router.post('/search', authController.APIKey, usersController.search)
router.delete('/:email', authController.APIKey, usersController.delete)
router.patch('/:email/update', authController.APIKey, usersController.update)

module.exports = router
