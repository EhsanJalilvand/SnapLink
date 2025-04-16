const express=require('express');
const router=express.Router();
const renderDashboardPage=require('../controllers/dashboardController')
router.get('/dashboard',renderDashboardPage.renderDashboardPage);

module.exports=router;