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

const campgrounds = require('./routes/Campground');
const reviews = require('./routes/Reviews');

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

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    next();
});

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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