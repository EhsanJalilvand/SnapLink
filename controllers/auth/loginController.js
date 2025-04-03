const passport = require('passport');

exports.renderLoginPage= (req, res) => {
    res.render('login');
};

exports.loginUser= passport.authenticate('local', {
    successRedirect: '/',  
    failureRedirect: '/login',  
    failureFlash: true 
});

