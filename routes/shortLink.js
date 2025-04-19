const express = require('express');
const router = express.Router();
const shortLinkController = require('..//controllers/shortlinkController')

const generatelinkSchema = require('../services/validationSchemas/generatelinkSchema')
const validationSchema = require('../services/validationSchema')




router.post('/generatelink', validationSchema(generatelinkSchema,'index',true), shortLinkController.generateLink);

router.put('/s/description',shortLinkController.updateDescription);
router.put('/s/password',shortLinkController.updatePassword);
router.put('/s/expireDate',shortLinkController.updateExpireDate);
router.put('/s/status',shortLinkController.updateStatus);
router.get('/s/:shortId',shortLinkController.visit);
module.exports = router;