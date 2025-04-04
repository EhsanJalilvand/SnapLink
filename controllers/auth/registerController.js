const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/user');
const emailService = require('../../services/emailService')

exports.renderRegisterPage = (req, res) => {
    res.render('register');
};

exports.register = async (req, res) => {
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
        await emailService.sendEmail(email, 'Verify Your Email', `Click here to verify: ${verificationLink}`);

        req.flash('message', 'Registration successful! Check your email for verification link.');
        res.redirect('/register');
    } catch (err) {
        req.flash('error', 'Registration failed');
        res.render('register');
        console.error(err);
    }
};

