var express = require('express')
var router = express.Router()
var clientsController = require('../controllers/ClientsController')

router.get('/:external_id', clientsController.get)
router.post('/add', clientsController.add)
router.post('/search', clientsController.search)
router.delete('/:external_id', clientsController.delete)
router.patch('/:external_id/update', clientsController.update)

module.exports = router