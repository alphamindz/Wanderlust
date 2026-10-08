const express = require('express');
const router = express.Router();
const {
  estimateTripBudget,
  generateItinerary,
  generateHostListingContent,
} = require('../services/aiService');

// @route   POST /api/ai/estimate-budget
// @desc    Calculate total travel budget with accommodation, food, transit, & sightseeing
// @access  Public
router.post('/estimate-budget', async (req, res) => {
  try {
    const { location, country, pricePerNight, nights, guests, travelStyle, language } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Destination location is required',
      });
    }

    const budgetEstimate = await estimateTripBudget({
      location,
      country: country || '',
      pricePerNight: Number(pricePerNight) || 200,
      nights: Number(nights) || 4,
      guests: Number(guests) || 2,
      travelStyle: travelStyle || 'Moderate',
      language: language || 'en',
    });

    res.status(200).json({
      success: true,
      budget: budgetEstimate,
    });
  } catch (error) {
    console.error('AI Budget estimation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate budget estimate',
      error: error.message,
    });
  }
});

// @route   POST /api/ai/generate-itinerary
// @desc    Generate personalized 3-day or 5-day day-by-day travel plan
// @access  Public
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { title, location, country, days, interests, pace, language } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required to generate itinerary',
      });
    }

    const itinerary = await generateItinerary({
      title: title || 'Wanderlust Vacation Stay',
      location,
      country: country || '',
      days: Number(days) || 3,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Culture', 'Scenic Views', 'Local Food'],
      pace: pace || 'Balanced',
      language: language || 'en',
    });

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error('AI Itinerary generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary',
      error: error.message,
    });
  }
});

// @route   POST /api/ai/generate-listing-content
// @desc    Generate high-converting property titles & description for hosts
// @access  Public
router.post('/generate-listing-content', async (req, res) => {
  try {
    const { location, category, propertyType, keyFeatures, vibe, language } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Property location is required to generate descriptions',
      });
    }

    const content = await generateHostListingContent({
      location,
      category: category || 'Trending',
      propertyType: propertyType || 'Entire Villa',
      keyFeatures: keyFeatures || [],
      vibe: vibe || 'Luxury & Serene',
      language: language || 'en',
    });

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error('AI Listing Content generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate listing content',
      error: error.message,
    });
  }
});

// @route   POST /api/ai/chat
// @desc    Converse with WanderBot side AI Concierge
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, history, currentListing, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    const { chatWithAssistant } = require('../services/aiService');
    const result = await chatWithAssistant({
      message: message.trim(),
      history: history || [],
      currentListing: currentListing || null,
      language: language || 'en',
    });

    res.status(200).json({
      success: true,
      reply: result.reply,
    });
  } catch (error) {
    console.error('AI Chat Assistant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message,
    });
  }
});

// @route   POST /api/ai/translate
// @desc    Translate property description into target language using Gemini AI
// @access  Public
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description text is required for translation',
      });
    }

    const { translatePropertyDescription } = require('../services/aiService');
    const result = await translatePropertyDescription({
      text: text.trim(),
      targetLanguage: targetLanguage || 'es',
      sourceLanguage: sourceLanguage || 'en',
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('AI Translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to translate description',
      error: error.message,
    });
  }
});

// @route   POST /api/ai/plan-entire-trip
// @desc    Plan an entire end-to-end trip blueprint with Wanderlust
// @access  Public
router.post('/plan-entire-trip', async (req, res) => {
  try {
    const { destination, days, travelers, travelStyle, vibes, language } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required to plan your trip',
      });
    }

    const { planEntireTrip } = require('../services/aiService');
    const blueprint = await planEntireTrip({
      destination: destination.trim(),
      days: Number(days) || 5,
      travelers: Number(travelers) || 2,
      travelStyle: travelStyle || 'Moderate',
      vibes: Array.isArray(vibes) && vibes.length > 0 ? vibes : ['Culture & History', 'Local Culinary & Wine'],
      language: language || 'en',
    });

    res.status(200).json({
      success: true,
      blueprint,
    });
  } catch (error) {
    console.error('AI Plan Entire Trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate comprehensive trip blueprint',
      error: error.message,
    });
  }
});

module.exports = router;


