const express=require('express');
const morgan = require('morgan');
const app=express();
app.use(morgan('tiny'));
app.use(express.static('public'));
app.set('view engine','ejs');
app.listen(3000);
app.get('/',(req,res)=>{
res.render('index',{Title:'Home'});
});
app.get('/about',(req,res)=>{
    res.render('about',{Title:'About Me'});
    });
    app.get('/register',(req,res)=>{
        res.render('register',{Title:'Register',message:'',error:''});
        });