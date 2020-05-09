var express = require('express')
var router = express.Router()
var authController = require('../controllers/AuthController')
var scraperController = require('../controllers/ScraperController')

router.post('/add', authController.APIKey, scraperController.addToScraperQueue)
router.post('/start', authController.APIKey, scraperController.executeScraper)
router.post('/startSQS', authController.APIKey, scraperController.executeScraperSQS)
router.get('/pullSQS', authController.APIKey, scraperController.pullFromSQS)

module.exports = router