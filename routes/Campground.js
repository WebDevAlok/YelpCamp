const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campgrounds')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, validateCampground, catchAsync(campground.createNew));

router.get('/new', isLoggedIn, campground.renderNewForm);

router.route('/:id')
    .get(catchAsync(campground.show))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

module.exports = router;