var express = require('express')
var router = express.Router()
var rolesController = require('../controllers/RolesController')

router.get('/:name', rolesController.get)
router.post('/add', rolesController.add)

module.exports = router