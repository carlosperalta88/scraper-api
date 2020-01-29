var express = require('express')
var router = express.Router()
var usersController = require('../controllers/UsersController')

router.get('/:email', usersController.get)
router.post('/add', usersController.add)
router.post('/search', usersController.search)
router.delete('/:email', usersController.delete)
router.patch('/:email/update', usersController.update)

module.exports = router