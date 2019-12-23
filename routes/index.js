var express = require('express');
var router = express.Router();
var cases = require('./cases');
var courts = require('./courts');
var scraper = require('./scraper');

router.use('/cases', cases);
router.use('/courts', courts);
router.use('/scrape', scraper);

module.exports = router;
