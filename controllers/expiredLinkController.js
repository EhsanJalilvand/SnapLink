
exports.expiredLinkPage= (req, res) => {
    res.render('expiredLink',{ title:res.__('expiredLink')});
};