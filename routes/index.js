var express = require('express');
var router = express.Router();
const admin = require('../controllers/admin')
const contact = require('../controllers/contact')

/* GET home page. */
router.get('/',admin.login);
router.post('/contact',contact.saveRequest);

module.exports = router;
