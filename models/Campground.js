const mongoose = require('mongoose');
const Review = require('./Reviews')
const Schema = mongoose.Schema;
mongoose.set('strictQuery', true);

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_400');
})

const CampgroundSchema = new Schema({
    images: [ImageSchema],
    title: String,
    price: Number,
    description: String,
    location: {
        name: String,
        geometry: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
        }
    },
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] 
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);