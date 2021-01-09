var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) { 
    //user: which will be used as the payload when you're creating the JsonWebToken
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
//token will be included in the authentication header here
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extract auth token from header
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => { //verify function; done : callback
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); //2nd parameter = user doesnt exist
            }
            else if (user) {
                return done(null, user); // no err
            }
            else {
                return done(null, false);
            }
         });
    }));

//the client will include the token in every subsequent incoming request in the authorization header.
//we can verify the authorization header by calling verifyUser
exports.verifyUser = passport.authenticate('jwt', {session: false}); // not creating sessions this case, using tokens instead

/* Header:
Authorization:
bear <jwt token string>
*/