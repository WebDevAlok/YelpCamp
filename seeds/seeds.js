if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const Campground = require('../models/Campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console,'connection error:'));
db.once("open", () => {
    console.log('Database Connected');
});

async function fetchLocation() {
    const random1000 = Math.floor(Math.random() * 1000);
    const name = `${cities[random1000].city}, ${cities[random1000].state}`;
    const geoData = await geocoder.forwardGeocode({
        query: name,
        limit: 1
    }).send()
    const location = {
        name: name,
        geometry: geoData.body.features[0].geometry
    }
    return location
}

const fetchImage = [
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563210/YelpCamp/jtqnb5q6kctdpe6dtnpl.jpg',
        filename: 'YelpCamp/jtqnb5q6kctdpe6dtnpl'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563210/YelpCamp/i7fbsttmznn0mdmyqzuf.jpg',
        filename: 'YelpCamp/i7fbsttmznn0mdmyqzuf'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563210/YelpCamp/vexipzdmuen1s4piryb9.jpg',
        filename: 'YelpCamp/vexipzdmuen1s4piryb9'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/dwp49h1tyijvrqsdofaj.jpg',
        filename: 'YelpCamp/dwp49h1tyijvrqsdofaj'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/lorefpue2cnoy0a2ohxz.jpg',
        filename: 'YelpCamp/lorefpue2cnoy0a2ohxz'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/l7onqg3qr77kkk462xt9.jpg',
        filename: 'YelpCamp/l7onqg3qr77kkk462xt9'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/nxibkdnnrir9trktmwk0.jpg',
        filename: 'YelpCamp/nxibkdnnrir9trktmwk0'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/mdql2mih15kkgiolrvd7.jpg',
        filename: 'YelpCamp/mdql2mih15kkgiolrvd7'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/ecqumvudczdnblgr8u4u.jpg',
        filename: 'YelpCamp/ecqumvudczdnblgr8u4u'
    },
    {
        url: 'https://res.cloudinary.com/dsmi2iybf/image/upload/v1679563211/YelpCamp/ajzm6zulayxzfo0owpoy.jpg',
        filename: 'YelpCamp/ajzm6zulayxzfo0owpoy'
    }
]

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i<5; i++) {
        const camp = new Campground( {
            author: '63c0f8bbbd32b09d384fe670',
            images: [
                fetchImage[i],
                fetchImage[i+5]
            ],
            title: `${ sample(descriptors) } ${ sample(places) }`,
            price: `${10 + Math.floor(Math.random() * 20)}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tristique iaculis sem. Aliquam sagittis imperdiet leo, sed rhoncus enim. In eget auctor nisl, ut malesuada nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
            location: await fetchLocation(),
        })
        await camp.save();
        //Uncomment the next line to prints out the value of random1000 use for selecting cities from cities.js
        //console.log(`${random1000}, ${cities[random1000].rank - 1}`); 
        //console.log(`${ descriptors[Math.floor(Math.random() * descriptors.length)] } ${  places[Math.floor(Math.random() * places.length)] }`);
        //`${fetchImage[i]}`,
        //`${fetchImage[i+5]}` 
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})