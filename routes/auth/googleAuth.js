const express = require('express');
const router = express.Router();
const googleAuthController=require('../../controllers/auth/googleAuthController')


router.get('/auth/google', googleAuthController.googleAuth);

router.get('/auth/google/callback',
    googleAuthController.googleCallback,
    googleAuthController.redirectAfterGoogleAuth);

module.exports = router;
