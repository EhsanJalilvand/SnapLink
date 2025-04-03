const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
};

exports.redirectAfterGoogleAuth = (req, res) => {
    res.redirect('/');
};
