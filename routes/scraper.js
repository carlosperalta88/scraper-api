var express = require('express')
var router = express.Router()
var scraperController = require('../controllers/ScraperController')

// router.get('/start')
// router.get('/status')
router.post('/:role/:court/add', scraperController.addRoleToScraperQueue)
router.post('/add/all', scraperController.addManyRolesToScraperQueue)
router.post('/start', scraperController.executeScraper)

module.exports = router