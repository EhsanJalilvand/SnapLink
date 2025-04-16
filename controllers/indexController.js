exports.renderIndexPage = (req, res) => {
    res.render('index', { title: res.__('Home') });
};
