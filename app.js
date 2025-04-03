const express = require('express');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const flash = require('connect-flash');
const authRoutes=require('./routes/auth');
const indexRoute=require('./routes/index')
const aboutRoute=require('./routes/about')
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(flash());
app.set('view engine', 'ejs');

require('./middlewares/authentication');
const setLocals= require('./middlewares/setLocals');
app.use(require('express-session')({
    secret: 'your_secret_key',  
    resave: false,  
    saveUninitialized: false,
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(setLocals());



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(3000);
        console.log('Listen Port 3000');
    }
    )
    .catch(err => console.log(err));


app.use('',authRoutes);
app.use('',indexRoute);
app.use('',aboutRoute);
