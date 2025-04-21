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

// Controllers and Routes
const notFoundController = require('./controllers/notFoundController');
const loginRoute = require('./routes/auth/login');
const registerRoute = require('./routes/auth/register');
const googleAuthRoute = require('./routes/auth/googleAuth');
const forgotPasswordRoute = require('./routes/auth/forgotPassword');
const verifyRoute = require('./routes/auth/verify');
const logoutRoute = require('./routes/auth/logout');
const indexRoute = require('./routes/index');
const shortLinkRoute = require('./routes/shortLink');
const aboutRoute = require('./routes/about');
const languageRoute = require('./routes/language');
const confirmLinkRoute = require('./routes/confirmLink');
const expiredLinkRoute = require('./routes/expiredLink');
const dashboardRoute = require('./routes/dashboard');

// Initialize Express App
const app = express();

// Middleware setup
require('./middlewares/authentication');
const setLocals = require('./middlewares/setLocals');
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

// Session and Passport setup
app.use(require('express-session')({
    secret: process.env.SECRET_KEY,
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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT);
        console.log(`Listen Port ${process.env.PORT}`);
    })
    .catch(err => console.log(err));

// Routes setup
app.use(loginRoute);
app.use(registerRoute);
app.use(googleAuthRoute);
app.use(forgotPasswordRoute);
app.use(verifyRoute);
app.use(logoutRoute);
app.use(indexRoute);
app.use(shortLinkRoute);
app.use(aboutRoute);
app.use(languageRoute);
app.use(confirmLinkRoute);
app.use(expiredLinkRoute);
app.use(dashboardRoute);

// 404 Handler
app.use(notFoundController.notFoundPage);

