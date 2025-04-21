const ShortLink = require('../models/shortlink');

// Renders the dashboard page if the user is logged in
exports.renderDashboardPage = (req, res) => {
    if (!req.user)
        return res.redirect('login'); 
    res.render('dashboard', { title: res.__('dashboard') });
};

// Fetches and displays the user's short links with pagination
exports.showlinks = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Please Login into System', redirect: '/login' }); // Return error if no user

    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 
    const skip = (page - 1) * pageSize; // Calculate the number of items to skip

    // Fetch the short links 
    const shortLinks = await ShortLink.find({ userId: req.user._id })
        .select('-password -userId') // Exclude password and userId fields
        .sort({ createdAt: -1 }) // Sort by creation date desc
        .skip(skip)
        .limit(pageSize);

    const totalItems = await ShortLink.countDocuments({ userId: req.user._id }); 
    const pageCount = Math.ceil(totalItems / pageSize); 

    const protocol = req.protocol; 
    const host = req.get('host'); 

    // Create the final response with the short link URL
    const itemsWithShortLink = shortLinks.map(item => {
        const { relativeLink, ...rest } = item.toObject();
        return {
            ...rest,
            title: item.title || '_', // Default title if not provided
            shortLink: `${protocol}://${host}/s/${item.relativeLink}` // Construct the full short link
        };
    });

    // Return the paginated response with the items and meta data
    res.json({
        items: itemsWithShortLink,
        page,
        pageSize,
        pageCount,
        totalItems
    });
};
