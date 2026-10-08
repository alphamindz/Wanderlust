const mongoose = require('mongoose');
const Review = require('./Review');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    default: '',
  },
});

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    image: {
      type: imageSchema,
      required: [true, 'Main property image is required'],
    },
    images: [imageSchema],
    price: {
      type: Number,
      required: [true, 'Please specify the price per night'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the property city or location'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide the country'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Trending',
        'Beachfront',
        'Iconic Cities',
        'Castles',
        'Cabins',
        'Mansions',
        'Camping',
        'Arctic',
        'Farms',
        'Luxe',
        'Lakefront',
        'Islands',
      ],
      default: 'Trending',
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0],
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    amenities: {
      type: [String],
      default: ['Fast WiFi', 'Air conditioning', 'Kitchen', 'Free parking'],
    },
    guests: {
      type: Number,
      default: 2,
      min: 1,
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: 0,
    },
    beds: {
      type: Number,
      default: 1,
      min: 1,
    },
    baths: {
      type: Number,
      default: 1,
      min: 0.5,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for spatial queries
listingSchema.index({ geometry: '2dsphere' });
listingSchema.index({ category: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ title: 'text', location: 'text', country: 'text' });

// Cascade delete reviews when a listing is removed
listingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Listing', listingSchema);
