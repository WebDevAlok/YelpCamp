const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../Schema');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/Campground');
const { isLoggedIn } = require('../middleware');

router.get('/', catchAsync(async (req,res) => {
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

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully made a new Campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get('/new', isLoggedIn, (req,res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'The Campground was not found.');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show',{campground});
    }
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success','Successfully updated the Campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground!');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground was not found.');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/edit',{campground}); 
    }
}));

module.exports = router;