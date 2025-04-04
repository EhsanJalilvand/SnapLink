
exports.renderAboutPage= (req, res) => {
    res.render('about',{ title:res.__('about')});
};