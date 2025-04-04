const path = require('path');
const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'de', 'fa'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'fa',
    queryParameter: 'lang',
    cookie: 'lang'
});

const setLanguage = (req, res, next) => {
    const lang = req.cookies.lang || 'fa';
    req.setLocale(lang);
    res.locals.lang = lang;
    next();
};


module.exports = { i18n, setLanguage };
