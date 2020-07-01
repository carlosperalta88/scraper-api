const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const scraperController = require('../controllers/ScraperController')

router.post('/add', authController.APIKey, scraperController.addToScraperQueue)
router.post('/start', authController.APIKey, scraperController.executeScraper)
router.post('/startSQS',
    authController.APIKey, scraperController.executeScraperSQS)
router.get('/pullSQS', authController.APIKey, scraperController.pullFromSQS)

module.exports = router
