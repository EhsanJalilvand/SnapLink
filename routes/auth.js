const express = require('express');
const router=express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    secure: false,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

require('../middlewares/authentication');

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',  
    failureRedirect: '/login',  
    failureFlash: true 
}));
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', async (req, res) => {
    try {
        const { displayname, email, password } = req.body;
        const hashedPassword =await bcrypt.hash(password, 10);
        const verificationToken = jsonwebtoken.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newUser = new User({
            displayName: displayname,
            email,
            isVerified: false,
            password:hashedPassword,
            verificationToken
        });
        await newUser.save();

        const verificationLink = `http://localhost:3000/verify/${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            text: `Click here to verify: ${verificationLink}`
        });
        req.flash('message', 'Registration successful! Check your email for verification link.');
        res.render('register');
    }
    catch (err) {
        req.flash('error', 'Registration failed');
        res.render('register');
        console.error(err);
    }

});
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        await User.findOneAndUpdate({ email: decoded.email }, { isVerified: true, verificationToken: null });
        res.redirect('/');
    }
    catch (err) {
        console.log(err);
        res.send('Invalid Or expired Token');
    }
});


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/'); 
    }
);


router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = router; 