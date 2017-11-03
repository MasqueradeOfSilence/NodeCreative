var express = require('express');
var fs = require('fs');
const https = require('https');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('weather.html', { root:  'public' });
});

//fix
/*
router.get('/getword', function(req, res, next) {
  var myword = 'https://owlbot.info/api/v1/dictionary/';
request(myword).pipe(res);
} */

router.get('/getcity', function(req, res, next) {
  fs.readFile(__dirname + '/cities.dat.txt',function(err,data) {
    if(err) throw err;
    var jsonresult = [];

    var cities = data.toString().split('\n');
    var searchStr = req.query.q;
    if (searchStr) {
      var myRe = new RegExp("^" + req.query.q.toLowerCase());
    } else {
      var myRe = new RegExp("^");
    }

    for(var i = 0; i < cities.length; i++) {
      var results = cities[i].toLowerCase().search(myRe);
      if (results != -1) {
        console.log(cities[i]);
        jsonresult.push({city:cities[i]});
      }
    }
    res.status(200).json(jsonresult);
  })
})

router.get('/getword', function(req, res, next) {

  var result = [];

  https.get('https://owlbot.info/api/v1/dictionary/' + req.query.w, function(response) {
    response.on('data', function(d) {
      result += d;
    });
    response.on('end', function() {
      res.status(200).json(JSON.parse(result));
    })
  })
})

module.exports = router;
