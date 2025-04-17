const express=require('express');
const router=express.Router();
const dashboardController=require('../controllers/dashboardController')
router.get('/dashboard',dashboardController.renderDashboardPage);
router.get('/links',dashboardController.showlinks);

module.exports=router;