const express = require('express');
const router = express.Router();
const loginController=require('../../controllers/auth/loginController')

router.get('/login',loginController.renderLoginPage);

router.post('/login',loginController.loginUser);

module.exports = router;
