const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../../controllers/auth/forgotPasswordController');

router.get('/forgot-password', forgotPasswordController.renderForgotPasswordPage);
router.post('/forgot-password', forgotPasswordController.sendResetCode);

router.get('/reset-password', forgotPasswordController.renderResetPasswordPage);
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;