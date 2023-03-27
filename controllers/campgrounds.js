const Campground = require('../models/Campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createNew = async (req,res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    //console.log(geoData.body.features[0].geometry)
    const { campground } = req.body;
    //console.log(campground);
    const newCampground = new Campground(campground);
    newCampground.location.name = campground.location;
    newCampground.location.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.author = req.user._id;
    await newCampground.save();
    //console.log(newCampground);
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
    //console.log(req.body);
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCampground.images.push(...imgs);
    await updatedCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        //console.log(updatedCampground);
    }
    req.flash('success','Successfully updated the Campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}

module.exports.delete = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground!');
    res.redirect('/campgrounds');
}