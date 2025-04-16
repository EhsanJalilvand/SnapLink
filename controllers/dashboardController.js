
exports.renderDashboardPage= (req, res) => {
    res.render('dashboard',{ title:res.__('dashboard')});
};