var express = require('express');
var router = express.Router();
var cases = require('./cases');
var courts = require('./courts');
var scraper = require('./scraper');
var clients = require('./clients');
var users = require('./users');
var roles = require('./roles');
var casesData = require('./casesData');

router.use('/cases', cases);
router.use('/courts', courts);
router.use('/scrape', scraper);
router.use('/clients', clients);
router.use('/users', users);
router.use('/roles', roles);
router.use('/cases-data')

module.exports = router;
