const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');  
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = new User({
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    isVerified: true,
                    password: null,
                    verificationToken: null
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));
passport.use(new LocalStrategy({
    usernameField: 'email',  
    passwordField: 'password',
    passReqToCallback: true  
}, async (req,email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: req.__('invalid_email_or_password') });
        }
        if (!user.isVerified) {
            return done(null, false, { message: req.__('verify_email') });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: req.__('invalid_email_or_password') });
        }

        return done(null, user);  
    } catch (err) {
        return done(err);  
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
