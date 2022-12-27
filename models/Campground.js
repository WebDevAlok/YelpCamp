const mongoose = require('mongoose');
const Review = require('./Reviews')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    image: String,
    title: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] 
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    console.log("Deleted!!!")
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);