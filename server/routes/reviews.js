const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const { isLoggedIn, isReviewAuthor } = require('../middleware/auth');

// Helper to recalculate average rating & count
const updateListingRating = async (listingId) => {
  const reviews = await Review.find({ listing: listingId });
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? Number(
          (reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount).toFixed(2)
        )
      : 0;

  await Listing.findByIdAndUpdate(listingId, { averageRating, reviewCount });
};

// @route   POST /api/listings/:id/reviews
// @desc    Add a review for a listing
// @access  Private
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required to submit a review',
      });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({
      listing: id,
      author: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property',
      });
    }

    const newReview = new Review({
      rating: Number(rating),
      comment: comment.trim(),
      author: req.user._id,
      listing: id,
    });

    await newReview.save();

    // Push into listing reviews array
    listing.reviews.push(newReview._id);
    await listing.save();

    // Recalculate listing rating stats
    await updateListingRating(id);

    const populatedReview = await Review.findById(newReview._id).populate(
      'author',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review',
    });
  }
});

// @route   DELETE /api/listings/:id/reviews/:reviewId
// @desc    Delete a review
// @access  Private (Review author only)
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // Remove reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    // Recalculate average rating
    await updateListingRating(id);

    res.status(200).json({
      success: true,
      message: 'Review removed successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
});

module.exports = router;
