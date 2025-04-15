exports.notFoundPage= (req, res) => {
    res.status(404).render('404',
        {
            title:res.__('404'),
            originalUrl: req.originalUrl,
        }
    );
};