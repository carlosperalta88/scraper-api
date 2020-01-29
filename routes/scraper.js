var express = require('express')
var router = express.Router()
var scraperController = require('../controllers/ScraperController')

router.get('/:queue/length', scraperController.getQueueLength)
router.post('/:role/:court/add', scraperController.addRoleToScraperQueue)
router.post('/add/all/:client', scraperController.addManyRolesToScraperQueue)
router.post('/start', scraperController.executeScraper)

module.exports = router