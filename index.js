const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const ejsmate = require('ejs-mate');
const { campgroundSchema } = require('./Schema')
const Campground = require('./models/Campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console,'connection error:'));
db.once("open", () => {
    console.log('Database Connected');
});

app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

app.get('/campgrounds', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

const validateCampground = (req,res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.post('/campgrounds', validateCampground, catchAsync(async (req,res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show',{campground});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
}));

app.get('/makeCampground', catchAsync(async (req,res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'Cheap Camping'});
    await camp.save();
    res.send(camp);
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