var express = require('express')
var router = express.Router()
var scraperController = require('../controllers/ScraperController')

router.get('/:queue/length', scraperController.getQueueLength)
router.post('/add', scraperController.addToScraperQueue)
router.post('/start', scraperController.executeScraper)

module.exports = router