var express = require('express')
var router = express.Router()
var authController = require('../controllers/AuthController')
var scraperController = require('../controllers/ScraperController')

router.post('/add', authController.APIKey, scraperController.addToScraperQueue)
router.post('/start', authController.APIKey, scraperController.executeScraper)

module.exports = router