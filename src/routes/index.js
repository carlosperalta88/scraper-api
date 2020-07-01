const express = require('express');
const router = express.Router();
const cases = require('./cases');
const courts = require('./courts');
const scraper = require('./scraper');
const clients = require('./clients');
const users = require('./users');
const roles = require('./roles');
const casesData = require('./casesData');
const reports = require('./reports');
const executions = require('./executions')

router.use('/cases', cases);
router.use('/courts', courts);
router.use('/scrape', scraper);
router.use('/clients', clients);
router.use('/users', users);
router.use('/roles', roles);
router.use('/cases-data', casesData);
router.use('/reports', reports);
router.use('/executions', executions);

module.exports = router;
