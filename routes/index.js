const express = require('express');
const router = express.Router();
const indexController = require('..//controllers/index')

const generatelinkSchema = require('../services/validationSchemas/generatelinkSchema')
const validationSchema = require('../services/validationSchema')

router.get('/', indexController.renderIndexPage);


router.post('/generatelink', validationSchema(generatelinkSchema,'index',true), indexController.generateLink);

router.get('/s/:shortId',indexController.visit);
module.exports = router;