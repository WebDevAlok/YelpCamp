const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../Schema');
const Reviews = require('../models/Reviews');
const Campground = require('../models/Campground');
const catchAsync = require('../utils/catchAsync');


const validateReview = (req,res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Reviews(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!');
    res.redirect(`/campgrounds/${ campground._id }`);
}));

router.delete('/:reviewId', catchAsync(async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Successfully deleted Review!');
    res.redirect(`/campgrounds/${ id }`);
}));

module.exports = router;