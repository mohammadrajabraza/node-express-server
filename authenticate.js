const 
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    jwt = require('jsonwebtoken'),
    FacebookTokenStrategy = require('passport-facebook-token');


const User = require('./models/user');

const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
}

let opts = {}; 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log(`JWT payload: ${jwt_payload}`);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if(user) {
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    }
    else{
        let err = new Error('You are not authorized to do this operation!');
        err.status = 403;
        return next(err);
    }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID : config.facebook.clientId,
    clientSecret : config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if(err) {
            return done(err, false);
        }
        if(!err && user != null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if(err){
                    return done(err, false);
                }
                else{
                    return done(null, user);
                }
            })
        }
    });
}
));