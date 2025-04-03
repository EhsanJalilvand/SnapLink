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

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));

app.set('view engine', 'ejs');

require('./helper/passport-config');

app.use(require('express-session')({
    secret: 'your_secret_key',  
    resave: false,  
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user || null;
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
    res.render('index', { Title: 'Home' });
});
app.get('/about', (req, res) => {
    res.render('about', { Title: 'About Me' });
});
app.get('/login', (req, res) => {
    res.render('login', { Title: 'Login', message: '', error: '' });
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',  
    failureRedirect: '/login',  
    failureFlash: true 
}));
app.get('/register', (req, res) => {
    res.render('register', { Title: 'Register', message: '', error: '' });
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

        res.render('register', { message: 'Registration successful! Check your email for verification link.', error: '', Title: 'Register' });
    }
    catch (err) {
        res.render('register', { message: '', error: 'Registration failed', Title: 'Register' });
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
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
