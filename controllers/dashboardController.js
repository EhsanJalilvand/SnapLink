const ShortLink = require('../models/shortlink');

exports.renderDashboardPage= (req, res) => {
    if (!req.user)
        return res.redirect('login');
    res.render('dashboard',{ title:res.__('dashboard')});
};
exports.showlinks = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' });

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const shortLinks = await ShortLink.find({ userId: req.user._id })
    .select('-password -userId') 
    .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(pageSize);

    const totalItems = await ShortLink.countDocuments({ userId: req.user._id });
    const pageCount = Math.ceil(totalItems / pageSize);


    const protocol = req.protocol;
    const host = req.get('host');
    const itemsWithShortLink = shortLinks.map(item => {
        const { relativeLink, ...rest } = item.toObject();
        return {
        ...rest,
        title: item.title || '_',
        shortLink: `${protocol}://${host}/s/${item.relativeLink}`
        }
    });

    res.json({
        items: itemsWithShortLink,
        page,
        pageSize,
        pageCount,
        totalItems
    });
};