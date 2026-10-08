const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleListings = [
  {
    title: 'The Royal Cliff Villa & Infinity Pool',
    description:
      'Perched atop the dramatic caldera cliffs of Oia, this ultra-luxurious cave villa offers panoramic Aegean sea vistas, private heated cliffside infinity pool, marble ensuite bathrooms, and sunset wine pairings delivered daily.',
    image: {
      url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      filename: 'santorini-cliff-villa',
    },
    price: 680,
    location: 'Oia, Santorini',
    country: 'Greece',
    category: 'Beachfront',
    geometry: {
      type: 'Point',
      coordinates: [25.3753, 36.4618], // Oia, Santorini [lng, lat]
    },
    amenities: [
      'Infinity Pool',
      'Aegean Sea View',
      'Fast WiFi (250 Mbps)',
      'Chef Kitchen',
      'Daily Housekeeping',
      'Hot Tub',
      'Air conditioning',
    ],
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
  },
  {
    title: 'Modern Alpine Glass Chalet with Matterhorn View',
    description:
      'Architect-designed alpine luxury at 1,600m. Floor-to-ceiling glass reveals uninterrupted views of the Matterhorn. Features Finnish sauna, open hearth fireplace, private ski-in/ski-out access, and custom sheepskin lounge furnishings.',
    image: {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      filename: 'zermatt-glass-chalet',
    },
    price: 920,
    location: 'Zermatt, Valais',
    country: 'Switzerland',
    category: 'Cabins',
    geometry: {
      type: 'Point',
      coordinates: [7.7491, 45.9765], // Zermatt
    },
    amenities: [
      'Ski-in / Ski-out',
      'Matterhorn Views',
      'Finnish Sauna',
      'Wood Fireplace',
      'Heated Floors',
      'Hot Tub',
      'Espresso Bar',
    ],
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 3,
  },
  {
    title: 'Skyline Penthouse with Private Zen Garden',
    description:
      'Hover 40 stories above Shinjuku in this minimalist Japanese penthouse. Features hinoki cedar soaking tub, private rooftop zen garden, smart home lighting, tatami tea ceremony room, and floor-to-ceiling city skyline views.',
    image: {
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      filename: 'tokyo-skyline-penthouse',
    },
    price: 490,
    location: 'Shinjuku, Tokyo',
    country: 'Japan',
    category: 'Iconic Cities',
    geometry: {
      type: 'Point',
      coordinates: [139.7006, 35.6897], // Tokyo
    },
    amenities: [
      'Hinoki Cedar Bath',
      'Rooftop Zen Garden',
      'Ultra Fast Fiber WiFi',
      'Dedicated Workspace',
      'Tokyo Tower View',
      'Smart Home Controls',
    ],
    guests: 3,
    bedrooms: 1,
    beds: 2,
    baths: 1.5,
  },
  {
    title: 'Bamboo Eco Palace & Waterfall Sanctuary',
    description:
      'Immerse in pure tropical bliss within Ubud’s sacred Ayung river valley. Handcrafted from curved black bamboo, this architectural marvel boasts an open-concept living pavilion, natural freshwater plunge pool, and lush jungle canopy.',
    image: {
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      filename: 'bali-bamboo-palace',
    },
    price: 340,
    location: 'Ubud, Bali',
    country: 'Indonesia',
    category: 'Trending',
    geometry: {
      type: 'Point',
      coordinates: [115.2625, -8.5069], // Ubud
    },
    amenities: [
      'Private River Plunge Pool',
      'Organic Breakfast Included',
      'Outdoor Jungle Shower',
      'Yoga Shala',
      'High-Speed Starlink WiFi',
      'Airport Shuttle',
    ],
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
  },
  {
    title: 'Highland 15th-Century Historic Castle Estate',
    description:
      'Live like royalty in a restored 15th-century stone castle set amidst 200 private acres of loch-side pine forest. Includes great hall with stone fireplace, antique library, turrets with 360-degree estate views, and private whisky vault.',
    image: {
      url: 'https://images.unsplash.com/photo-1524397076568-5a7e65dbcb4c?auto=format&fit=crop&w=1200&q=80',
      filename: 'scotland-highland-castle',
    },
    price: 1450,
    location: 'Inverness, Highlands',
    country: 'United Kingdom',
    category: 'Castles',
    geometry: {
      type: 'Point',
      coordinates: [-4.2247, 57.4778], // Inverness
    },
    amenities: [
      '200 Acre Private Estate',
      'Grand Banquet Hall',
      'Historic Library',
      'Whisky Tasting Cellar',
      'Indoor Fireplaces',
      'Loch Access',
    ],
    guests: 12,
    bedrooms: 6,
    beds: 8,
    baths: 5,
  },
  {
    title: 'Villa Bellagio on the Shores of Lake Como',
    description:
      'Palatial neoclassical villa overlooking Lake Como. Features classical colonnades, private deep-water boat dock, terraced olive groves, Italian marble baths, and private captain service available on request.',
    image: {
      url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
      filename: 'lake-como-villa',
    },
    price: 1100,
    location: 'Bellagio, Lake Como',
    country: 'Italy',
    category: 'Lakefront',
    geometry: {
      type: 'Point',
      coordinates: [9.2629, 45.9872], // Lake Como
    },
    amenities: [
      'Private Boat Dock',
      'Lakefront Terrace',
      'Outdoor Dining Gazebo',
      'Wine Cellar',
      'Air conditioning',
      'Concierge Service',
    ],
    guests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 4,
  },
  {
    title: 'Glass Igloo Aurora Borealis Resort',
    description:
      'Sleep under the mesmerizing dance of the Northern Lights inside a thermally-insulated glass igloo cabin. Features motorized reclining beds, private sauna cabin, reindeer sleigh trails, and uninterrupted snowy Arctic wilderness.',
    image: {
      url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
      filename: 'arctic-glass-igloo',
    },
    price: 750,
    location: 'Tromso, Lapland',
    country: 'Norway',
    category: 'Arctic',
    geometry: {
      type: 'Point',
      coordinates: [18.9553, 69.6492], // Tromso
    },
    amenities: [
      'Heated Panoramic Glass Roof',
      'Aurora Borealis Wake-Up Call',
      'Traditional Wood Sauna',
      'Snowshoe Equipment',
      'Breakfast & Dinner',
    ],
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  },
  {
    title: 'Beverly Hills Ultra-Modern Architectural Estate',
    description:
      'Celebrity enclave mansion perched above Sunset Plaza. Boasts an infinity-edge pool cantilevering toward downtown Los Angeles, screening room, master suite with steam shower, and 12-car gated motor court.',
    image: {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      filename: 'beverly-hills-mansion',
    },
    price: 1850,
    location: 'Beverly Hills, California',
    country: 'United States',
    category: 'Mansions',
    geometry: {
      type: 'Point',
      coordinates: [-118.4004, 34.0736], // Beverly Hills
    },
    amenities: [
      'Zero-Edge Pool',
      'Private Cinema',
      'Gated Security',
      'Commercial Kitchen',
      'Smart House Automation',
      'Gym & Spa',
    ],
    guests: 10,
    bedrooms: 5,
    beds: 6,
    baths: 6,
  },
  {
    title: 'Amalfi Coast Terraced Mediterranean Haven',
    description:
      'Suspended between azure sky and turquoise sea, this secluded Positano retreat features lemon-scented bougainvillea gardens, wood-fired pizza oven, cliffside sunbeds, and access to secluded coves.',
    image: {
      url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      filename: 'positano-cliff-haven',
    },
    price: 590,
    location: 'Positano, Amalfi Coast',
    country: 'Italy',
    category: 'Beachfront',
    geometry: {
      type: 'Point',
      coordinates: [14.484, 40.6281], // Positano
    },
    amenities: [
      'Private Sea Descent',
      'Wood-Fired Pizza Oven',
      'Panoramic Balcony',
      'Fast WiFi',
      'Air conditioning',
    ],
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
  },
  {
    title: 'Romantic Haussmannian Apartment Facing Eiffel Tower',
    description:
      'Elegant 7th Arrondissement Parisian home featuring ornate plaster moldings, herringbone oak parquet floors, marble fireplaces, and wrought-iron Juliet balconies framing the sparkling Eiffel Tower.',
    image: {
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      filename: 'paris-eiffel-apartment',
    },
    price: 430,
    location: '7th Arrondissement, Paris',
    country: 'France',
    category: 'Iconic Cities',
    geometry: {
      type: 'Point',
      coordinates: [2.302, 48.8584], // Paris Eiffel Tower
    },
    amenities: [
      'Direct Eiffel Tower View',
      'Herringbone Oak Parquet',
      'Elevator Access',
      'Nespresso Coffee Bar',
      'Fast WiFi',
    ],
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  },
  {
    title: 'Luxury Safari Tent in Wilderness Biosphere',
    description:
      'Sleep under starry southern skies with the sounds of African wildlife. Canvas safari suite elevated on mahogany decking, featuring copper clawfoot outdoor bathtub, plunge pool, and private ranger-guided game drives.',
    image: {
      url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
      filename: 'safari-luxury-tent',
    },
    price: 520,
    location: 'Kruger National Park',
    country: 'South Africa',
    category: 'Camping',
    geometry: {
      type: 'Point',
      coordinates: [31.5547, -24.0116], // Kruger
    },
    amenities: [
      'Outdoor Clawfoot Tub',
      'Solar Power & WiFi',
      'Game Drive Included',
      'Bushveld Dining',
      'Plunge Pool',
    ],
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  },
  {
    title: 'Redwood Forest Treehouse & Cedar Hot Tub',
    description:
      'Live among giant ancient redwoods 30 feet in the air. Connected by suspension bridges, this handcrafted treehouse retreat features spiral staircases, skylights under the forest canopy, and a wood-fired cedar soaking tub.',
    image: {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      filename: 'redwood-treehouse',
    },
    price: 380,
    location: 'Big Sur, California',
    country: 'United States',
    category: 'Cabins',
    geometry: {
      type: 'Point',
      coordinates: [-121.8081, 36.2704], // Big Sur
    },
    amenities: [
      'Cedar Wood Hot Tub',
      'Suspension Bridge Walkway',
      'Wood Burning Stove',
      'Kitchenette',
      'Starlink High-Speed Internet',
    ],
    guests: 3,
    bedrooms: 1,
    beds: 2,
    baths: 1,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wanderlust';
    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for database seeding...');

    // Clear existing collections
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    console.log(' Cleared old data.');

    // Create Demo Users
    const hostUser = await User.create({
      name: 'Elena Rostova',
      email: 'host@wanderlust.com',
      password: 'password123',
      role: 'host',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Superhost of architectural gems and seaside sanctuaries. Passionate about world design and luxury hospitality.',
    });

    const guestUser = await User.create({
      name: 'Marcus Vance',
      email: 'traveler@wanderlust.com',
      password: 'password123',
      role: 'user',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Digital nomad and photographer capturing landscapes across 45 countries.',
    });

    console.log(` Created Demo Users:`);
    console.log(`   Host: host@wanderlust.com / password123`);
    console.log(`   Traveler: traveler@wanderlust.com / password123`);

    const ratingsPool = [4.7, 4.8, 4.9, 4.6, 4.9, 4.85, 4.95, 4.75, 4.88, 4.92, 4.65, 4.9];
    const reviewCountsPool = [84, 126, 48, 92, 67, 154, 38, 112, 59, 142, 73, 89];

    // Insert Listings
    for (let i = 0; i < sampleListings.length; i++) {
      const item = sampleListings[i];
      const assignedRating = ratingsPool[i % ratingsPool.length];
      const assignedReviewCount = reviewCountsPool[i % reviewCountsPool.length];

      const listing = new Listing({
        ...item,
        owner: hostUser._id,
        averageRating: assignedRating,
        reviewCount: assignedReviewCount,
      });

      await listing.save();

      // Create glowing reviews from guestUser
      const sampleReviews = [
        {
          rating: Math.round(assignedRating),
          comment:
            'An absolute masterpiece! The views took our breath away from the second we walked in. The host thought of every single detail.',
        },
        {
          rating: 5,
          comment:
            'Exceeded our expectations in every conceivable way. Impeccably clean, peaceful, and stunning design. Will definitely be returning next season.',
        },
      ];

      const reviewDoc = await Review.create({
        rating: sampleReviews[i % sampleReviews.length].rating,
        comment: sampleReviews[i % sampleReviews.length].comment,
        author: guestUser._id,
        listing: listing._id,
      });

      listing.reviews.push(reviewDoc._id);
      await listing.save();
    }

    console.log(` Successfully seeded ${sampleListings.length} premium listings with reviews!`);
    await mongoose.connection.close();
    console.log(' Database connection closed. Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(' Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
