const express=require('express');
const router=express.Router();
const disabledLinkController=require('../controllers/disabledLinkController')

router.get('/disabledLink',disabledLinkController.disabledLinkPage);
module.exports=router;