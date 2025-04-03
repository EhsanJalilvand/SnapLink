const express = require('express');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const flash = require('connect-flash');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(flash());
app.set('view engine', 'ejs');

require('./helper/passport-config');

app.use(require('express-session')({
    secret: 'your_secret_key',  
    resave: false,  
    saveUninitialized: false,
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    if (!res.locals.message)
    res.locals.message = req.flash('message');
    if (!res.locals.error)
    res.locals.error = req.flash('error');
    if (!res.locals.title)
    {
        let filename = req.path.split('/').pop() || 'index'; 
        console.log(filename);
        res.locals.title = filename.charAt(0).toUpperCase() + filename.slice(1);
    }
    console.log(req.user);
    next();
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    secure: false,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(3000);
        console.log('Listen Port 3000');
    }
    )
    .catch(err => console.log(err));




app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',  
    failureRedirect: '/login',  
    failureFlash: true 
}));
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
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
app.get('/verify/:token', async (req, res) => {
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


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/'); 
    }
);


app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
