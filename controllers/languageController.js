exports.changeLanguage = (req, res) => {
    const { lang } = req.params;
    res.cookie('lang', lang, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
    const returnUrl = req.get('Referer') || '/';
    res.redirect(returnUrl);
};