const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const { isLoggedIn, isOwner } = require('../middleware/auth');
const { upload, isCloudinaryConfigured } = require('../config/cloudinary');
const { forwardGeocode } = require('../utils/geocoder');

// @route   GET /api/listings
// @desc    Get all listings with filtering, search & sorting
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Keyword Search across title, location, country
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { location: regex }, { country: regex }];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { averageRating: -1 };

    const listings = await Listing.find(query)
      .populate('owner', 'name avatar')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message,
    });
  }
});

// @route   GET /api/listings/user/my-listings
// @desc    Get listings owned by the logged-in user
// @access  Private
router.get('/user/my-listings', isLoggedIn, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your listings',
    });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing with populated owner and reviews
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          select: 'name avatar',
        },
      })
      .populate('owner', 'name email avatar bio');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found',
      });
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error('Error fetching listing detail:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving property listing',
    });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing (with image upload & forward geocoding)
// @access  Private
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      category,
      imageUrl,
      amenities,
      guests,
      bedrooms,
      beds,
      baths,
    } = req.body;

    if (!title || !description || !price || !location || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please fill out all required fields',
      });
    }

    // Determine image source: uploaded file or external image URL
    let imageData = {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      filename: 'default-cover',
    };

    if (req.file) {
      if (isCloudinaryConfigured && req.file.path) {
        imageData = {
          url: req.file.path,
          filename: req.file.filename,
        };
      } else {
        // Local upload fallback
        imageData = {
          url: `/uploads/${req.file.filename}`,
          filename: req.file.filename,
        };
      }
    } else if (imageUrl && imageUrl.trim()) {
      imageData = {
        url: imageUrl.trim(),
        filename: 'custom-url',
      };
    }

    // Forward geocode the location to get coordinates
    const geometry = await forwardGeocode(location, country);

    // Parse amenities if passed as JSON string or comma-separated
    let parsedAmenities = ['Fast WiFi', 'Kitchen', 'Free parking'];
    if (amenities) {
      if (Array.isArray(amenities)) {
        parsedAmenities = amenities;
      } else if (typeof amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch {
          parsedAmenities = amenities.split(',').map((a) => a.trim());
        }
      }
    }

    const listing = new Listing({
      title,
      description,
      price: Number(price),
      location,
      country,
      category: category || 'Trending',
      image: imageData,
      geometry,
      owner: req.user._id,
      amenities: parsedAmenities,
      guests: guests ? Number(guests) : 2,
      bedrooms: bedrooms ? Number(bedrooms) : 1,
      beds: beds ? Number(beds) : 1,
      baths: baths ? Number(baths) : 1,
    });

    await listing.save();

    const populatedListing = await Listing.findById(listing._id).populate(
      'owner',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Property listing published successfully!',
      listing: populatedListing,
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create listing',
    });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update an existing listing
// @access  Private (Owner only)
router.put('/:id', isLoggedIn, isOwner, upload.single('image'), async (req, res) => {
  try {
    const listing = req.listing; // Attached by isOwner middleware
    const {
      title,
      description,
      price,
      location,
      country,
      category,
      imageUrl,
      amenities,
      guests,
      bedrooms,
      beds,
      baths,
    } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = Number(price);
    if (category) listing.category = category;
    if (guests) listing.guests = Number(guests);
    if (bedrooms) listing.bedrooms = Number(bedrooms);
    if (beds) listing.beds = Number(beds);
    if (baths) listing.baths = Number(baths);

    // Re-geocode if location or country changed
    if (
      (location && location !== listing.location) ||
      (country && country !== listing.country)
    ) {
      listing.location = location || listing.location;
      listing.country = country || listing.country;
      listing.geometry = await forwardGeocode(listing.location, listing.country);
    }

    // Update image if a new one is uploaded or URL provided
    if (req.file) {
      if (isCloudinaryConfigured && req.file.path) {
        listing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      } else {
        listing.image = {
          url: `/uploads/${req.file.filename}`,
          filename: req.file.filename,
        };
      }
    } else if (imageUrl && imageUrl.trim()) {
      listing.image = {
        url: imageUrl.trim(),
        filename: 'custom-url',
      };
    }

    if (amenities) {
      if (Array.isArray(amenities)) {
        listing.amenities = amenities;
      } else if (typeof amenities === 'string') {
        try {
          listing.amenities = JSON.parse(amenities);
        } catch {
          listing.amenities = amenities.split(',').map((a) => a.trim());
        }
      }
    }

    await listing.save();

    const updatedListing = await Listing.findById(listing._id).populate(
      'owner',
      'name avatar'
    );

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update listing',
    });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
// @access  Private (Owner only)
router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
    });
  }
});

module.exports = router;
