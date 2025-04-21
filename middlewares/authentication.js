const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');  // Mongoose User model

/**
 * Configure Google OAuth strategy
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,         // Google client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
    callbackURL: "/auth/google/callback"            // URL Google redirects to after authentication
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = new User({
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    isVerified: true,          // Automatically verify users authenticated by Google
                    password: null,            // No password since user logs in via Google
                    verificationToken: null,   // No need for email verification
                    createdAt: Date.now()
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

/**
 * Configure Local Strategy for email/password login
 */
passport.use(new LocalStrategy({
    usernameField: 'email',  
    passwordField: 'password', 
    passReqToCallback: true          // Pass the entire request object to the callback
}, async (req, email, password, done) => {
    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user || !user.password) {
            return done(null, false, { message: req.__('invalid_email_or_password') });
        }
        if (!user.password) {
            return done(null, false, { message: req.__('invalid_email_or_password') });
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

/**
 * Serialize user instance to store in session
 */
passport.serializeUser((user, done) => {
    done(null, user.id);  // Store user ID in session
});

/**
 * Deserialize user instance from session
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);  
        done(null, user);
    } catch (err) {
        done(err, null);  
    }
});
