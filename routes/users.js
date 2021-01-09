var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var User = require('../models/user');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<html><title>Express MongoDB Fullstack Project</title><body><h1>Users Page</h1></body></html>');
});

//signup: store account info in database (either the account is created or not)
router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user)=>{
    if (user != null){
      var err = new Error('User ' + req.body.username + 'already exists!');
      err.status = 403;
      return next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err)=> next(err));
})

//post: store account info in session(either it is logged in or not)
router.post('/login', (req, res, next) => {
  if (!req.session.user) { //not signed in before (not sessioned)
    var authHeader = req.headers.authorization;

    if (!authHeader){
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic'); //send back the respond with header 'WWW-Authenticate', reprompt for username and password
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then((user) => {
      if (!user) {
        var err = new Error('User ' + req.body.username + 'does not exists!');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password){
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password){
        req.session.user = 'authenticated'; //request's session because it changes the key stored in the server side
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err) => next(err));
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

router.get('/logout', (req, res, next) => { //get because server can track your info from the session id from the session cookie
  if (req.session){
    req.session.destroy(); //clear the session on the server side
    res.clearCookie('session-id'); //clear the cookie on the client side
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
