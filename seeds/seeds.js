const mongoose = require('mongoose');
const Campground = require('../models/Campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console,'connection error:'));
db.once("open", () => {
    console.log('Database Connected');
});

const fetchImage = ['https://images.unsplash.com/photo-1502459225234-12ab69bd5f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY3MTEyNDIzNw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080','https://images.unsplash.com/photo-1493515694075-fff2d464227d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY3MTEyNDM0OA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080','https://images.unsplash.com/photo-1499618838676-f1a9bc076843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY3MTEyNDQ4Mw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080','https://images.unsplash.com/photo-1504106379193-10da019d1e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY3MTEyNDQ5Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080','https://images.unsplash.com/photo-1496216342243-42635b603639?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY3MTEyNDUyMA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080']

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i<5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground( {
            author: '63c0f8bbbd32b09d384fe670',
            image: `${fetchImage[i]}`,
            title: `${ sample(descriptors) } ${ sample(places) }`,
            price: `${10 + Math.floor(Math.random() * 20)}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tristique iaculis sem. Aliquam sagittis imperdiet leo, sed rhoncus enim. In eget auctor nisl, ut malesuada nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
        })
        await camp.save();
        //Uncomment the next line to prints out the value of random1000 use for selecting cities from cities.js
        //console.log(`${random1000}, ${cities[random1000].rank - 1}`); 
        //console.log(`${ descriptors[Math.floor(Math.random() * descriptors.length)] } ${  places[Math.floor(Math.random() * places.length)] }`); 
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})