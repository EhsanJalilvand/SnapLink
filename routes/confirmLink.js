const express=require('express');
const router=express.Router();
const confirmLinkController=require('../controllers/confirmLinkController')

router.get('/confirmLink',confirmLinkController.confirmLinkPage);
router.post('/confirmLink', confirmLinkController.ConfirmLink);
module.exports=router;