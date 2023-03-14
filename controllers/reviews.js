const Reviews = require('../models/Reviews');
const Campground = require('../models/Campground');

module.exports.createReview = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Reviews(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!');
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.delete = async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted Review!');
    res.redirect(`/campgrounds/${ id }`);
}