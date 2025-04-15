const crypto = require('crypto');
const ShortLink = require('../models/shortlink');
const bcrypt = require('bcrypt');
exports.renderIndexPage = (req, res) => {
    res.render('index', { title: res.__('Home') });
};
exports.generateLink = async (req, res) => {

    if (!req.user) {
        req.flash('error', '');
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    }
    const error = req.flash('error');
    if ((error && error.length > 0)) {
        return res.status(400).json(error);
    }
    const originalLink = req.body.originalLink;
    await generateShortLink(req, originalLink, (code, link) => {

        const shortLink = new ShortLink({
            userId: req.user._id,
            originalLink: originalLink,
            relativeLink: code,
            isEnable: true,
            expiredDateTime: null,
            password: null
        });
        shortLink.save();
        res.json({ id: shortLink._id, shortLink: link });
    });
};

exports.visit = async (req, res) => {
    const shortId = req.params.shortId;
    if (!shortId)
        return;
    const shortLink = await ShortLink.findOne({ relativeLink: shortId });
    if (!shortLink)
        return;
    const currentDate = new Date();
    console.log(shortLink,currentDate)
    if(shortLink.expireDateTime<=currentDate)
    {
        console.log('Expired.................')
       return res.render("expiredLink",{expireDate:shortLink.expireDateTime});
    }
    if(shortLink.password)
    {
        console.log('Id:',shortLink._id);
       return res.render("confirmLink",{linkId:shortLink._id});
    }
    res.redirect(shortLink.originalLink);
};

exports.updateDescription = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id)
        return res.status(400).json({ message: 'Input Data Is Not Correct' });
    shortLink.title = req.body.title;
    shortLink.description = req.body.description;
    shortLink.save();
    res.json({ id: shortLink._id, title: shortLink.title, description: shortLink.description });
}
exports.updatePassword = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id)
        return res.status(400).json({ message: 'Input Data Is Not Correct' });
    shortLink.password =await bcrypt.hash(req.body.password,10);
    shortLink.save();
    res.json({ id: shortLink._id });
}

exports.updateExpireDate = async (req, res) => {
    console.log(req.body);
    if (!req.user)
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id)
        return res.status(400).json({ message: 'Input Data Is Not Correct' });
    shortLink.expireDateTime =req.body.expireDate;
    shortLink.save();
    res.json({ id: shortLink._id });
}


async function generateShortLink(req, originalLink, callback) {

    try {
        new URL(originalLink);
    } catch (_) {
        throw new Error(`link ${originalLink} is not valid`);
    }

    async function generateUniqueShortCode() {
        let shortCode;
        do {
            shortCode = crypto.randomBytes(4).toString('hex');
        } while (await ShortLink.findOne({ relativeLink: shortCode }));
        return shortCode;
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const shortCode = await generateUniqueShortCode();
    const shortLink = `${protocol}://${host}/s/${shortCode}`;

    callback(shortCode, shortLink);
}