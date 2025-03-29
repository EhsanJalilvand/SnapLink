const express = require('express');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // برای Gmail
    port: 587,  // پورت برای TLS
    secure: false,  // برای استفاده از TLS
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
app.get('/register', (req, res) => {
    res.render('register', { Title: 'Register', message: '', error: '' });
});
app.post('/register', async (req, res) => {
    try {
        const { displayname, email, password } = req.body;
        const hashedPassword = bcrypt.hash(password, 10);
        const verificationToken = jsonwebtoken.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newUser = new User({
            displayname,
            email,
            isVerified: false,
            hashedPassword,
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
app.get('/verifiy/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        await User.findByIdAndUpdate({ email: decoded.email }, { isVerified: true, verificationToken: null });
    }
    catch (err) {
        console.log(err);
        res.send('Invalid Or expired Token');
    }
});
