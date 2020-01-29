var express = require('express')
var router = express.Router()
var casesController = require('../controllers/CasesController')

router.post('/add', casesController.addCase)
router.post('/bulk/add', casesController.addCases)
router.get('/report/:client', casesController.buildReport)
router.get('/:role', casesController.getCaseByRole)
router.delete('/:role', casesController.deleteCaseByRole)
router.patch('/:role/update', casesController.compare, casesController.update)

module.exports = router