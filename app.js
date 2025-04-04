const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser'); 
const { i18n, setLanguage } = require('./language');
const loginRoute = require('./routes/auth/login');
const registerRoute = require('./routes/auth/register');
const googleAuthRoute = require('./routes/auth/googleAuth');
const verifyRoute = require('./routes/auth/verify');
const logoutRoute = require('./routes/auth/logout');
const indexRoute = require('./routes/index')
const aboutRoute = require('./routes/about')
const languageRoute=require('./routes/language')
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(flash());
app.use(cookieParser());
app.use(i18n.init);
app.use(setLanguage);
app.set('view engine', 'ejs');

require('./middlewares/authentication');
const setLocals = require('./middlewares/setLocals');



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

app.use(loginRoute);
app.use(registerRoute);
app.use(googleAuthRoute);
app.use(verifyRoute);
app.use(logoutRoute);
app.use(indexRoute);
app.use(aboutRoute);
app.use(languageRoute);