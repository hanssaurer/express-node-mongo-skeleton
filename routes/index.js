var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ressources and Things' });
console.log('routes/index-Request: ', req.originalUrl);
});

module.exports = router;
