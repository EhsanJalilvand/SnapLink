const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    secure: false,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.renderRegisterPage= (req, res) => {
    res.render('register');
};

exports.register=  async (req, res) => {
    try {
        const { displayname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jsonwebtoken.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newUser = new User({
            displayName: displayname,
            email,
            isVerified: false,
            password: hashedPassword,
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
    } catch (err) {
        req.flash('error', 'Registration failed');
        res.render('register');
        console.error(err);
    }
};

