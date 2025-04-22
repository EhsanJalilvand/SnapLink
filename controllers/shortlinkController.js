const crypto = require('crypto');
const ShortLink = require('../models/shortlink');
const bcrypt = require('bcrypt');

exports.renderIndexPage = (req, res) => {
    res.render('index', { title: res.__('Home') });
};

// Generates a new short link and saves it
exports.generateLink = async (req, res) => {
    if (!req.user) {
        req.flash('error', '');
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    }
    const error = req.flash('error');
    if (error && error.length > 0) return res.status(400).json(error);
    
    const originalLink = req.body.originalLink;
    await generateShortLink(req, originalLink, (code, link) => {
        const shortLink = new ShortLink({
            userId: req.user._id,
            originalLink: originalLink,
            relativeLink: code,
            isEnable: true,
            expiredDateTime: null,
            createdAt: new Date(),
            password: null
        });
        shortLink.save();
        res.json({ id: shortLink._id, shortLink: link, isEnable: shortLink.isEnable });
    });
};

// Handles the visit to a short link
exports.visit = async (req, res) => {
    const shortId = req.params.shortId;
    if (!shortId) return;
    const shortLink = await ShortLink.findOne({ relativeLink: shortId });
    if (!shortLink) return;
    
    // Check if the short link is disabled
    if (shortLink.isEnable !== true) return res.render("disabledLink");
    
    const currentDate = new Date();
    //Check if the short link has expired
    if (shortLink.expireAt && shortLink.expireAt <= currentDate) return res.render("expiredLink", { expireDate: shortLink.expireAt });
    
    //Check If the short link is protected by a password
    if (shortLink.password && shortLink.password) return res.render("confirmLink", { linkId: shortLink._id });
    
    //redirect to the original link
    res.redirect(shortLink.originalLink);
};

// Updates the description of a short link
exports.updateDescription = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id) return res.status(400).json({ message: 'Input Data Is Not Correct' });
    shortLink.title = req.body.title;
    shortLink.description = req.body.description;
    shortLink.save();
    res.json({ id: shortLink._id, title: shortLink.title, description: shortLink.description });
};

// Updates the password of a short link
exports.updatePassword = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id) return res.status(400).json({ message: 'Input Data Is Not Correct' });
    if(!req.body.password)
        shortLink.password=null;
    else    
    shortLink.password = await bcrypt.hash(req.body.password, 10);
    shortLink.save();
    res.json({ id: shortLink._id });
};

// Updates the expiration date of a short link
exports.updateExpireDate = async (req, res) => {
    console.log(req.body);
    if (!req.user) return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id) return res.status(400).json({ message: 'Input Data Is Not Correct' });
    shortLink.expireAt = req.body.expireDate;
    shortLink.save();
    res.json({ id: shortLink._id });
};

// Updates the status (enabled/disabled) of a short link
exports.updateStatus = async (req, res) => {
    console.log(req.body);
    if (!req.user) return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    const shortLink = await ShortLink.findById(req.body.id);
    if (shortLink && shortLink.userId != req.user._id) return res.status(400).json({ message: 'Input Data Is Not Correct' });
    shortLink.isEnable = req.body.isEnable;
    shortLink.save();
    res.json({ id: shortLink._id });
};

// Generates a unique short code and link for the original URL
async function generateShortLink(req, originalLink, callback) {
    try {
        new URL(originalLink); // Validate original link
    } catch (_) {
        throw new Error(`link ${originalLink} is not valid`);
    }

    async function generateUniqueShortCode() {
        let shortCode;
        do {
            shortCode = crypto.randomBytes(4).toString('hex'); // Generate unique short code
        } while (await ShortLink.findOne({ relativeLink: shortCode }));
        return shortCode;
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const shortCode = await generateUniqueShortCode();
    const shortLink = `${protocol}://${host}/s/${shortCode}`; // Construct the full short link

    callback(shortCode, shortLink); // Return the short link and code
}
