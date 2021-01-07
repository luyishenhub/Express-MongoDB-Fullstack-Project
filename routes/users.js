var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<html><title>Express MongoDB Fullstack Project</title><body><h1>Users Page</h1></body></html>');
});

module.exports = router;
