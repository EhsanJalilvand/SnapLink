const setLocals = () => {
    return (req, res, next) => {
        res.locals.user = req.user || null;
        if (!res.locals.message)
            res.locals.message = req.flash('message');
        if (!res.locals.error)
            res.locals.error = req.flash('error');
        if (!res.locals.title) {
            let filename = req.path.split('/').pop() || 'index';
            console.log(filename);
            res.locals.title = filename.charAt(0).toUpperCase() + filename.slice(1);
        }
        if (req.method === 'POST')
            res.locals.formData = { ...req.body } || {};
        else
        {
            res.locals.formData = {};
            req.flash('error', '');
        }
        next();
    }
}
module.exports = setLocals;