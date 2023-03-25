const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campgrounds')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const multer  = require('multer');
const { cStorage } = require('../cloudinary')
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: cStorage });



router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createNew));

router.get('/new', isLoggedIn, campground.renderNewForm);

router.route('/:id')
    .get(catchAsync(campground.show))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

module.exports = router;