const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const Schema = mongoose.Schema;
const opts = { toJSON:{ virtuals : true } };

// Image Schema
const imageSchema = new Schema({
    url: {
        type: String
    },
    filename: {
        type: String
    }
});

imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})


const CampgroundsSchema = new Schema({
    title: {
        type: String
    },
    images: [imageSchema],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

// Making virtual object Properties for displaying poUps on map
CampgroundsSchema.virtual("properties.popUpMarkup").get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.slice(0,20)}</p>
    `;
})

CampgroundsSchema.post("findOneAndDelete", async function (campground) {
    if (campground.reviews.length) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})


const Campground = mongoose.model("Campground", CampgroundsSchema);

module.exports = Campground;