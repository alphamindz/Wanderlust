/**
 * Formatting and pricing utility functions for Wanderlust
 */

/**
 * Format currency price
 * @param {number} amount
 * @returns {string} e.g. "$380"
 */
export const formatPrice = (amount) => {
  const num = Number(amount) || 0;
  return `$${num.toLocaleString('en-US')}`;
};

/**
 * Format rating to strictly 1 decimal place (e.g. 4.8)
 * @param {number} rating
 * @param {number} fallback
 * @returns {string} e.g. "4.8"
 */
export const formatRating = (rating, fallback = 4.9) => {
  const num = Number(rating);
  if (isNaN(num) || num <= 0) {
    return Number(fallback).toFixed(1);
  }
  return num.toFixed(1);
};

/**
 * Pluralize a word based on count
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string} e.g. "1 review" or "2 reviews"
 */
export const pluralize = (count, singular, plural = `${singular}s`) => {
  const num = Number(count) || 0;
  return `${num} ${num === 1 ? singular : plural}`;
};

/**
 * Pure price calculation helper
 * Computes live base price, cleaning fee, dynamic service fee, and total
 * @param {number} pricePerNight
 * @param {number} nights
 * @returns {{ nights: number, basePrice: number, cleaningFee: number, serviceFee: number, totalPrice: number }}
 */
export const calcPricing = (pricePerNight, nights = 1) => {
  const validNights = Math.max(1, Math.round(Number(nights) || 1));
  const rate = Number(pricePerNight) || 0;
  const basePrice = rate * validNights;
  // Standard fixed or proportional cleaning fee
  const cleaningFee = Math.max(35, Math.round(rate * 0.12));
  // 12% dynamic marketplace service fee
  const serviceFee = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  return {
    nights: validNights,
    basePrice,
    cleaningFee,
    serviceFee,
    totalPrice,
  };
};

export const MOCK_REVIEWS = [
  {
    _id: 'mock-1',
    author: {
      name: 'Sophia Bennett',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    rating: 5,
    date: 'October 2026',
    stayDuration: 'Stayed 4 nights',
    comment: 'The views are surreal and the attention to detail is remarkable. Every morning began with espresso on the balcony and quiet serenity. The host thought of every single comfort!',
  },
  {
    _id: 'mock-2',
    author: {
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    rating: 5,
    date: 'September 2026',
    stayDuration: 'Stayed 3 nights',
    comment: 'One of the most inspiring places I have ever stayed. Ultra-fast WiFi made remote work seamless, and the check-in was effortless. Will definitely book again next season.',
  },
  {
    _id: 'mock-3',
    author: {
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    rating: 5,
    date: 'August 2026',
    stayDuration: 'Stayed 5 nights',
    comment: 'Flawless hospitality. The architecture is pure poetry and the surrounding landscapes are blissfully peaceful. Everything was spotlessly clean and exceptionally well equipped.',
  },
  {
    _id: 'mock-4',
    author: {
      name: 'Lucas Moreau',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    rating: 5,
    date: 'July 2026',
    stayDuration: 'Stayed 2 nights',
    comment: 'Everything was immaculate. Check-in was smooth, the kitchen was well-stocked, and soaking under the starry canopy was an unforgettable highlight of our vacation.',
  },
  {
    _id: 'mock-5',
    author: {
      name: 'Elena Rossi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    rating: 5,
    date: 'June 2026',
    stayDuration: 'Stayed 6 nights',
    comment: 'A truly magical retreat. The location is prime yet secluded enough for total relaxation. The Superhost went above and beyond with local dining and transit recommendations.',
  },
  {
    _id: 'mock-6',
    author: {
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    rating: 5,
    date: 'May 2026',
    stayDuration: 'Stayed 3 nights',
    comment: 'Incredible ambiance, stylish interior design, and breathtaking panoramic scenery. Highly recommended for couples seeking a peaceful getaway.',
  },
];

/**
 * Derive unified review stats, rating categories, and reviews list
 * @param {object} listing
 * @param {Array} rawReviews
 * @returns {{ overallRating: number, formattedRating: string, reviewCount: number, categories: Array, reviewsList: Array }}
 */
export const getReviewStats = (listing, rawReviews = []) => {
  const rawList = Array.isArray(rawReviews) ? rawReviews : [];
  const rawCount = rawList.length;

  const ratingVal = Number(listing?.averageRating);
  const overallRating = !isNaN(ratingVal) && ratingVal > 0 ? ratingVal : 4.9;
  const formattedRating = formatRating(overallRating, 4.9);

  const reviewCount = Number(listing?.reviewCount) || (rawCount > 6 ? rawCount : 126);

  // Normalize user submitted reviews
  const normalizedUserReviews = rawList.map((r, i) => ({
    _id: r._id || `user-rev-${i}`,
    author: r.author || { name: 'Verified Guest', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    rating: Number(r.rating) || 5,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
    stayDuration: 'Verified Stay',
    comment: r.comment || '',
    isUserSubmitted: true,
  }));

  // Combine user reviews first, then standard mock reviews
  const reviewsList = [...normalizedUserReviews, ...MOCK_REVIEWS];

  const baseNum = Number(formattedRating) || 4.9;
  const categories = [
    { label: 'Cleanliness', value: Math.min(5.0, Number((baseNum + 0.05).toFixed(1))) },
    { label: 'Accuracy', value: Math.min(5.0, Number((baseNum + 0.02).toFixed(1))) },
    { label: 'Communication', value: 5.0 },
    { label: 'Location', value: Math.max(4.7, Number((baseNum - 0.02).toFixed(1))) },
    { label: 'Check-in', value: 5.0 },
    { label: 'Value', value: Math.max(4.6, Number((baseNum - 0.1).toFixed(1))) },
  ].map((cat) => ({
    label: cat.label,
    score: cat.value.toFixed(1),
    value: cat.value,
    width: `${((cat.value / 5) * 100).toFixed(1)}%`,
  }));

  return {
    overallRating,
    formattedRating,
    reviewCount,
    categories,
    reviewsList,
  };
};

/**
 * Format a date range cleanly
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {string} e.g. "Oct 12 – 16, 2026" or "Oct 28 – Nov 2, 2026"
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Dates flexible';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return `${startDate} – ${endDate}`;

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
};

