const express = require('express');
const router = express.Router();
const registerController=require('../../controllers/auth/registerController');
const registerSchema=require('../../services/validationSchemas/registerSchema')
const validationSchema=require('../../services/validationSchema')
router.get('/register',registerController.renderRegisterPage);

router.post('/register',validationSchema(registerSchema),registerController.register);

module.exports = router;
