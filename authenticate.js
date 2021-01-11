var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookTokenStrategy = require('passport-facebook-token');

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

/* Header:
Authorization:
bearer <jwt token string>
*/

//the client will include the token in every subsequent incoming request in the authorization header.
//we can verify the authorization header by calling verifyUser
exports.verifyUser = passport.authenticate('jwt', {session: false}); // not creating sessions this case, using tokens instead

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin){
        next();
    }
    else{
        console.log("NANCYYYYY\n"+req.user);
        var err = new Error('Only admin can do it');
        err.status = 403;
        return next(err);
    }
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));

