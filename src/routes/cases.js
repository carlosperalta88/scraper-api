var express = require('express')
var authController = require('../controllers/AuthController')
var router = express.Router()
var casesController = require('../controllers/CasesController')

router.post('/add', authController.APIKey, casesController.addCases)
router.post('/search', authController.APIKey, casesController.searchCases)
router.delete('/deactivate', authController.APIKey, casesController.deleteManyCasesByExternalId)
router.delete('/:role/deactivate', authController.APIKey, casesController.deleteCaseByRoleAndCourt)

module.exports = router