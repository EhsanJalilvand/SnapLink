const passport = require('passport');

exports.renderLoginPage= (req, res) => {
    res.render('login',{title:res.__('login_login')});
};

exports.loginUser= passport.authenticate('local', {
    successRedirect: '/',  
    failureRedirect: '/login',  
    failureFlash: true 
});

