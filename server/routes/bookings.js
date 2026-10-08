const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { isLoggedIn } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking reservation
// @access  Private
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalNights, guestsCount } = req.body;

    if (!listingId || !checkIn || !checkOut || !totalNights) {
      return res.status(400).json({
        success: false,
        message: 'Missing booking dates or listing identification',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Owner cannot book their own property
    const listingOwnerId = (listing.owner?._id || listing.owner?.id || listing.owner || '').toString();
    const currentUserId = (req.user?._id || req.user?.id || '').toString();
    if (listingOwnerId && currentUserId && listingOwnerId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own property',
      });
    }

    const nights = Number(totalNights);
    const pricePerNight = listing.price;
    const cleaningFee = 45;
    const serviceFee = Math.round(pricePerNight * nights * 0.12);
    const totalPrice = pricePerNight * nights + cleaningFee + serviceFee;

    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalNights: nights,
      pricePerNight,
      cleaningFee,
      serviceFee,
      totalPrice,
      guestsCount: Number(guestsCount) || 1,
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'listing',
      select: 'title location country image price',
    });

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get all bookings for the logged-in user
// @access  Private
router.get('/my-bookings', isLoggedIn, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'listing',
        select: 'title location country image price category geometry',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking reservation not found',
      });
    }

    if (!booking.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings',
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation',
    });
  }
});

module.exports = router;
