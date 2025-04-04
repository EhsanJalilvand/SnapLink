const express=require('express');
const router=express.Router();
const languageController=require('../controllers/languageController')

router.get('/change-lang/:lang',languageController.changeLanguage);

module.exports=router;