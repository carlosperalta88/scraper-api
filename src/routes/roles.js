const express = require('express')
const router = express.Router()
const rolesController = require('../controllers/RolesController')

router.get('/:name', rolesController.get)
router.post('/add', rolesController.add)

module.exports = router
