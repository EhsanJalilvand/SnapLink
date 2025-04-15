const express=require('express');
const router=express.Router();
const expiredLinkController=require('../controllers/expiredLinkController')

router.get('/expiredLink',expiredLinkController.expiredLinkPage);
module.exports=router;