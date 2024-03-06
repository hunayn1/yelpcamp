const mongoose = require("mongoose");

const cities = require("./cities");

const { descriptors, places } = require("./seedHelpers");

const Campground = require("../models/campgrounds");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection successfully made with Mongo")
    })
    .catch((err) => {
        console.log("Connection failed")
        console.log(err);
    })

// this function will pick a random out of an array
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 30) + 1;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // image: " https://source.unsplash.com/random?in the woods",
            geometry:{
                type:"Point",
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
            },
            images:
                [{
                    url: 'https://res.cloudinary.com/ddqvostyt/image/upload/v1709049259/YelpCamp/u4av1pfrlsry8ehb8iqz.jpg',
                    filename: 'YelpCamp/u4av1pfrlsry8ehb8iqz',
                },
                {
                    url: 'https://res.cloudinary.com/ddqvostyt/image/upload/v1709049261/YelpCamp/gddgdvmom5fs8qesylkt.jpg',
                    filename: 'YelpCamp/gddgdvmom5fs8qesylkt',
                },
                {
                    url: 'https://res.cloudinary.com/ddqvostyt/image/upload/v1709049263/YelpCamp/ub8ormrnb6r0alc2358s.jpg',
                    filename: 'YelpCamp/ub8ormrnb6r0alc2358s',
                }],
            description: "lorem ipsum",
            price,
            author: '65cf50230006d933aaf7c4bf'
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });