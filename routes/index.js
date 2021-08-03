var express = require('express');
var router = express.Router();
const admin = require('../controllers/admin')
const chat = require('../controllers/chat')
const home = require('../controllers/home')
const fetch_data = require('../controllers/fetch-data')
const cache = require('../cache/index')


/* GET home page. */
// [cache.checkAuthentication,cache.setUpcomingMatches]
router.get('/',[cache.checkAuthentication,cache.setUpcomingMatches],home.index);
router.post('/save-user',chat.save_user);
// Admin
router.all('/admin-login',admin.index);
router.post('/save-selected',admin.saveSelected);
router.get('/xx-featured-xx',cache.checkAuthentication,admin.featured);

router.post('/send-message',chat.send_message);
router.get('/get_allmessage',chat.get_allmessage);
router.get('/get_newmessage',chat.get_newmessage);

router.get('/live-score',[cache.checkAuthentication,cache.getLiveScore],fetch_data.getLiveScore);
router.get('/upcoming-matches',cache.checkAuthentication,cache.getUpcomingMatches,fetch_data.getUpcomingMatches);

module.exports = router;
