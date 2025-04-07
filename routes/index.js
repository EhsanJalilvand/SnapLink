const express = require('express');
const router = express.Router();
const indexController = require('..//controllers/index')

const generatelinkSchema = require('../services/validationSchemas/generatelinkSchema')
const validationSchema = require('../services/validationSchema')

router.get('/', indexController.renderIndexPage);


router.post('/generatelink', validationSchema(generatelinkSchema,'index',true), (req, res) => {
    const my_body = req.body;
    const error = req.flash('error');

    if ((error && error.length > 0)) {
       return res.status(400).json(error);
    }
    res.json({ message: `سلام، ${my_body.originalLink}! درخواست شما دریافت شد.` });
});

module.exports = router;