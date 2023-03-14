const express = require('express');
const router = express.Router({ mergeParams: true });
const review = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.delete));

module.exports = router;