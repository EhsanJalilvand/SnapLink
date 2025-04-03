const express = require('express');
const router = express.Router();
const verifyController=require('../../controllers/auth/verifyController')
router.get('/verify/:token',verifyController.verify);

module.exports = router;
