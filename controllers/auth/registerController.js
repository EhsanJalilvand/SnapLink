const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/user');
const sendEmail  = require('../../services/emailService')

exports.renderRegisterPage = (req, res) => {
    res.render('register',{ title:res.__('register')});
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
            verificationToken,
            createdAt:Date.now()
        });

        await newUser.save();

        const verificationLink =`${req.protocol}://${req.get('host')}/verify/${verificationToken}`;
        await sendEmail(email, 'Verify Your Email', `Click here to verify: ${verificationLink}`);
        console.info(`emai Sended to ${email}`);
        req.flash('message', 'Registration successful! Check your email for verification link.');
        res.redirect('/register');
    } catch (err) {
        req.flash('error', 'Registration failed');
        res.render('register');
        console.error(err);
    }
};

