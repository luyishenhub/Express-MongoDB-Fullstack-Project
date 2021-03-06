var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var authenticate = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());

/* GET users listing. */
//corsWithOptions because only admin can access this
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err:err});
  })
  // DateTime.remove({}, callback)
  // res.send('<html><title>Express MongoDB Fullstack Project</title><body><h1>Users Page</h1></body></html>');
});

//signup: store account info in database (either the account is created or not)
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  console.log(req.body.username);
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
      console.log(user);
    //cannot successfully register this new username-password pair (due to any reasons ex. already exists)
    if (err){
      res.statusCode = 500;
      res.setHeader ('Content-Type', 'application/json');
      res.json({err:err});
    }
    //if successfully registered to the DB
    else{
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if (req.body.admin)
        user.admin = req.body.admin;
      user.save((err, user) => { //save updated changes
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }

        // to authenticate local requests (automattically process the req info)
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        })
      });
    }
  })
})

//post: store account info in session/token(either it is logged in or not)
//passport.authenticate('local') uses local strategy to check if the user authentication is valid
//passport.authenticate('local') will automatically add user property to the request message
//passport.authenticat('local') decides either it is using session or token
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  //verify by local strategy, if success -> assign token to user
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) { //if successfully authenticated, then will load value to req.user
    //then after we can just use this express-server created token to log in as long as it is not expired
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router;
