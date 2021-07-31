var express = require('express');
var router = express.Router();
const admin = require('../controllers/admin')
const home = require('../controllers/home')
const fetch_data = require('../controllers/fetch-data')
const cache = require('../cache/index')


/* GET home page. */
router.get('/',[cache.checkAuthentication,cache.setUpcomingMatches],home.index);
// router.get('/',admin.login);
router.post('/save-selected-tournaments',admin.saveSelected);
router.get('/get-tournaments',cache.checkAuthentication,admin.getUpcomingTournaments);
router.get('/live-score',[cache.checkAuthentication,cache.getLiveScore],fetch_data.getLiveScore);
router.get('/upcoming-matches',cache.checkAuthentication,cache.getUpcomingMatches,fetch_data.getUpcomingMatches);

module.exports = router;
