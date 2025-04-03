const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/user');

exports.verify = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        await User.findOneAndUpdate({ email: decoded.email }, { isVerified: true, verificationToken: null });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.send('Invalid Or expired Token');
    }
};

