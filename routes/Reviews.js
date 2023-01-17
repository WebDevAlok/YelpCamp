const express = require('express');
const router = express.Router({ mergeParams: true });
const Reviews = require('../models/Reviews');
const Campground = require('../models/Campground');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Reviews(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!');
    res.redirect(`/campgrounds/${ campground._id }`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted Review!');
    res.redirect(`/campgrounds/${ id }`);
}));

module.exports = router;