if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsmate = require('ejs-mate');
const Campground = require('./models/Campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/Users')
const campgroundRoutes = require('./routes/Campground');
const reviewRoutes = require('./routes/Reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console,'connection error:'));
db.once("open", () => {
    console.log('Database Connected');
});

const app = express();

app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
    secret: 'ThisWillBeAnActualSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/fakeUser', async (req,res) => {
    const user = new User({ email: 'coltttt@gmail.com', username: 'colttt' });
    const newUser = await User.register( user, 'chicken');
    res.send(newUser);
})

app.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

app.all('*', (req,res,next) => {
    next(new ExpressError ('Page not Found',404));
})

app.use((err,req,res,next) => {
    const { statusCode = 500} = err;
    if (!err.message) err.message = 'Oh boy, Something went wrong!';
    res.status(statusCode).render('campgrounds/error', {err});
});

app.listen(3000, () => {
    console.log('Serving on port 3000!');
})