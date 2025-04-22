// Middleware to set commonly used variables in res.locals
const setLocals = () => {
    return (req, res, next) => {
        // Set the logged-in user, or null if not authenticated
        res.locals.user = req.user || null;

        // Retrieve flash messages (if any) and assign them to locals
        if (!res.locals.message)
            res.locals.message = req.flash('message');
        if (!res.locals.error) {
            res.locals.error = req.flash('error');
        }
        // Set a default page title based on the last part of the URL path
        if (!res.locals.title) {
            let filename = req.path.split('/').pop() || 'index';
            console.log(filename);
            res.locals.title = filename.charAt(0).toUpperCase() + filename.slice(1);
        }

        // If it's a POST request, store form data 
        if (req.method === 'POST') {
            res.locals.formData = { ...req.body } || {};
        } else {
            // Clear form data and error flash on GET requests
            res.locals.formData = {};
            req.flash('error', '');
        }

        next();
    }
};

module.exports = setLocals;
