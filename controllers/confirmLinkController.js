const bcrypt = require('bcrypt');
const ShortLink = require('../models/shortlink');
exports.confirmLinkPage = (req, res) => {
    res.render('confirmLink', { title: res.__('confirmLink') });
};

exports.ConfirmLink = async (req, res) => {

    try {
        const { linkId, password } = req.body;
        const shortLink = await ShortLink.findById(linkId);
   
        const isMatch = await bcrypt.compare(password, shortLink.password);
        if (isMatch)
            return res.redirect(shortLink.originalLink);
        console.log('incorrect Password!');

    } catch (err) {
        console.error(err);
    }
};