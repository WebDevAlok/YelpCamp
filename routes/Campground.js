const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../Schema');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/Campground');

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

router.post('/', validateCampground, catchAsync(async (req,res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    await newCampground.save();
    req.flash('success','Successfully made a new Campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get('/new', (req,res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show',{campground, msg: req.flash()});
}));

router.put('/:id', validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success','Successfully updated the Campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}));

router.delete('/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
}));

module.exports = router;