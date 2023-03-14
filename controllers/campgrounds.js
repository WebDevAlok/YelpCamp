const Campground = require('../models/Campground');

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createNew = async (req,res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully made a new Campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.show = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'The Campground was not found.');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show',{campground});
    }
}

module.exports.renderEditForm = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground was not found.');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/edit',{campground}); 
    }
}

module.exports.updateCampground = async (req,res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success','Successfully updated the Campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}

module.exports.delete = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground!');
    res.redirect('/campgrounds');
}