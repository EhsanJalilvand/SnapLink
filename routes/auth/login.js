const express = require('express');
const router = express.Router();
const loginController=require('../../controllers/auth/loginController');
const validationSchema=require('../../services/validationSchema');
const loginSchema=require('../../services/validationSchemas/loginSchema');
router.get('/login',loginController.renderLoginPage);

router.post('/login',validationSchema(loginSchema),loginController.loginUser);

module.exports = router;
