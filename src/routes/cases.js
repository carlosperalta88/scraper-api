const express = require('express')
const authController = require('../controllers/AuthController')
const router = express.Router()
const casesController = require('../controllers/CasesController')

router.post('/add', authController.APIKey, casesController.addCases)
router.post('/search', authController.APIKey, casesController.searchCases)
router.delete('/deactivate',
    authController.APIKey, casesController.deleteManyCasesByExternalId)
router.delete('/:role/deactivate',
    authController.APIKey, casesController.deleteCaseByRoleAndCourt)

module.exports = router
