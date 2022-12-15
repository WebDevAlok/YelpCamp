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

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i<5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground( {
            image: 'https://source.unsplash.com/collection/483251',
            title: `${ sample(descriptors) } ${ sample(places) }`,
            price: `${10 + Math.floor(Math.random() * 20)}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tristique iaculis sem. Aliquam sagittis imperdiet leo, sed rhoncus enim. In eget auctor nisl, ut malesuada nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla id risus a augue bibendum finibus vitae at elit. Mauris in mollis erat. Aenean at diam mattis, condimentum magna ut, faucibus lorem.',
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