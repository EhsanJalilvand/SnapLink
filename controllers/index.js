const crypto = require('crypto');
const ShortLink = require('../models/shortlink');
exports.renderIndexPage = (req, res) => {
    res.render('index', { title: res.__('Home') });
};
exports.generateLink = async (req, res) => {
    const my_body = req.body;
    if (!req.user) {
        req.flash('error', '');
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });
    }
    const error = req.flash('error');
    if ((error && error.length > 0)) {
        return res.status(400).json(error);
    }

    const generatedLink = await generateShortLink(req, req.body.originalLink);
    res.json({ shortLink: generatedLink });
};

async function generateShortLink(req, originalLink) {

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
    const shortLink = `${protocol}://${host}/${shortCode}`;

    return shortLink;
}