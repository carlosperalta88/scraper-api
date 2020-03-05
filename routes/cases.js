var express = require('express')
var router = express.Router()
var casesController = require('../controllers/CasesController')

router.post('/add', casesController.addCase)
router.post('/bulk/add', casesController.addCases)
router.post('/search', casesController.searchCases)
router.get('/reports/:client', casesController.buildReport)
router.delete('/deactivate', casesController.deleteManyCasesByExternalId)
router.delete('/:role/deactivate', casesController.deleteCaseByRoleAndCourt)
router.patch('/:role/update', casesController.update)

module.exports = router