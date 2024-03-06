const Campground = require("../models/campgrounds");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that Campground");
        res.redirect("/campgrounds");
    }
    else res.render("campgrounds/show", { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that Campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}
module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const { deleteImages } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true })
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...img);
    await campground.save();
    // deleting images
    if (deleteImages) {
        // deleting from clouindary
        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // deleting from mongo db
        await campground.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });
    }
    console.log(req.body);
    req.flash("success", "Campground Updated");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted Successfully")
    res.redirect("/campgrounds");
}