const crypto = require('crypto');
const User = require('../../models/user');
const sendEmail = require('../../services/emailService');
const bcrypt = require('bcrypt');
exports.renderForgotPasswordPage = (req, res) => {
    res.render('forgot-password', { title: res.__('forgot_password') });
};

exports.sendResetCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/forgot-password');
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        user.resetCodeExpire = Date.now() + 15 * 60 * 1000; // 15 Minute Expire Time
        await user.save();

        req.flash('message', 'Verification code sent to your email');
        res.redirect(`/reset-password?email=${email}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/forgot-password');
    }
};

exports.renderResetPasswordPage = (req, res) => {
    res.render('reset-password', { title: res.__('reset_password'), email: req.query.email });
};

exports.resetPassword = async (req, res) => {
    const { email, code, password,confirmPassword } = req.body;
    try {
        const user = await User.findOne({ email });

        if (password!=confirmPassword) {
            req.flash('error', 'Confirm Password Is Not Match');
            return res.redirect(`/reset-password?email=${email}`);
        }
        if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpire) {
            req.flash('error', 'Invalid or expired code');
            return res.redirect(`/reset-password?email=${email}`);
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetCode = undefined;
        user.resetCodeExpire = undefined;
        await user.save();

        req.flash('message', 'Password successfully reset. You can now log in.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to reset password');
        res.redirect(`/reset-password?email=${email}`);
    }
};
