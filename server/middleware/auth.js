const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');

// Verify JWT token and attach user to request
const isLoggedIn = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to perform this action',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'wanderlust_super_secret_jwt_key_2026_modern_mern'
    );
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};

// Check if logged in user is the owner of the listing
const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const listingOwnerId = (
      listing.owner?._id ||
      listing.owner?.id ||
      listing.owner ||
      ''
    ).toString();
    const currentUserId = (
      req.user?._id ||
      req.user?.id ||
      ''
    ).toString();

    const isMatch = listingOwnerId && currentUserId && listingOwnerId === currentUserId;
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isMatch && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to edit or delete this listing',
      });
    }

    req.listing = listing;
    next();
  } catch (err) {
    console.error('Error in isOwner authorization middleware:', err);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: err.message,
    });
  }
};

// Check if logged in user is the author of the review
const isReviewAuthor = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const reviewAuthorId = (
      review.author?._id ||
      review.author?.id ||
      review.author ||
      ''
    ).toString();
    const currentUserId = (
      req.user?._id ||
      req.user?.id ||
      ''
    ).toString();

    const isMatch = reviewAuthorId && currentUserId && reviewAuthorId === currentUserId;
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isMatch && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own reviews',
      });
    }

    req.review = review;
    next();
  } catch (err) {
    console.error('Error in isReviewAuthor authorization middleware:', err);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: err.message,
    });
  }
};

module.exports = {
  isLoggedIn,
  isOwner,
  isReviewAuthor,
};

