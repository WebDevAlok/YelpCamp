const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Campground = require('./models/Campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console,'connection error:'));
db.once("open", () => {
    console.log('Database Connected');
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.get('/', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('index',{campgrounds});
})

app.get('/makeCampground', async (req,res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'Cheap Camping'});
    await camp.save();
    res.send(camp);
})

app.listen(3000, () => {
    console.log('Serving on port 3000!');
})