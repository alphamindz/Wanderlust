# 🧭 Wanderlust — Modern MERN Full-Stack Vacation Rental Platform

Wanderlust is a decoupled full-stack web application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) that connects property hosts with travelers across the globe. Unlike traditional server-side templated applications, Wanderlust is designed with a fast Single Page Application (SPA) frontend, stateless JWT security, real-time spatial geocoding, and dynamic interactive vector maps.

---

## 🏗️ Architecture & Tech Stack

### 💻 Frontend (`/client`)
- **React.js & Vite**: Ultra-fast SPA rendering with lightning HMR.
- **React Router DOM (v6)**: Client-side routing with deep link states (`/`, `/listings/:id`, `/listings/new`, `/listings/:id/edit`, `/login`, `/signup`, `/my-listings`, `/my-bookings`).
- **Axios Layer**: Automatic JWT `Bearer` token injection via request interceptors.
- **Dynamic Maps**: Interactive vector map with custom animated Wanderlust pin markers, popup previews, and full pan/zoom capabilities (supports Mapbox GL & Leaflet/OSM).
- **Lucide-React**: Vector iconography throughout navigation, amenities, reviews, and filters.
- **Bespoke Design System**: Custom Vanilla CSS with glassmorphism, responsive cards, micro-animations, Outfit & Plus Jakarta Sans typography.

### ⚙️ Backend REST API (`/server`)
- **Node.js & Express.js**: RESTful microservice handling CRUD endpoints, reviews, bookings, and error handling.
- **JWT & Bcrypt.js**: Salted password encryption and stateless authentication.
- **Ownership & Auth Middlewares**: `isLoggedIn`, `isOwner`, and `isReviewAuthor` protecting listings and reviews.
- **MongoDB Atlas & Mongoose ODM**: Relational data modeling with 2dsphere spatial indexing for GeoJSON coordinates.
- **Cloud Media Pipeline**: Multer and Cloudinary CDN uploads with automatic local filesystem fallback.
- **Spatial Geocoding**: Forward geocoding service converting city/country queries to GeoJSON `[longitude, latitude]` coordinates.

### 🤖 Smart Multilingual AI Features (Powered by Google Gemini 1.5 Flash)
- **Multilingual AI Concierge (WanderBot)**: Conversational travel & host concierge answering in 11 world languages (English, Hindi, Spanish, French, German, Japanese, Chinese, Arabic, Italian, Portuguese, Russian).
- **AI Trip Budget & Expense Estimator**: Automatically calculates accommodation, food & dining, local transportation, and sightseeing costs with localized notes, daily averages, and local savings tips.
- **AI Smart Itinerary Planner**: Generates personalized 3-day or 5-day day-by-day travel plans with morning, afternoon, evening activities, durations, insider tips, curated dining, and packing advice in the user's selected language.
- **AI Description & Title Generator for Hosts**: Allows hosts to generate magnetic titles and evocative descriptions in any chosen world language simply by entering 2-3 key highlights.
- **On-Demand AI Property Description Translator**: Instant translation of property descriptions into 11 languages with 1-click language chips.
- **Intelligent Fallback Architecture**: Seamlessly works out-of-the-box with built-in multilingual destination intelligence even before configuring `GEMINI_API_KEY`, and switches to live Google Gemini 1.5 Flash when the API key is provided!

### 🌍 Internationalization (i18n & 11 World Languages)
- Instant client-side language switching across **English, Hindi (हिन्दी), Spanish (Español), French (Français), German (Deutsch), Japanese (日本語), Chinese (中文), Arabic (العربية), Italian (Italiano), Portuguese (Português), and Russian (Русский)**.
- Full RTL (Right-to-Left) bidirectional support for Arabic (`dir="rtl"`).
- Searchable language modal in the top navigation bar and footer.

---

## 🚀 Quick Start Guide

### 1. Database & Seeding
The database has been seeded with 12 world-class luxury properties (Santorini, Tokyo, Swiss Alps, Lake Como, Bali, Beverly Hills, etc.) along with reviews and demo accounts:

```bash
cd server
npm run seed
```

**Pre-configured Demo Accounts:**
| Role | Email | Password |
|---|---|---|
| 👑 **Superhost** | `host@wanderlust.com` | `password123` |
| 🧳 **Traveler** | `traveler@wanderlust.com` | `password123` |

*(You can also use the 1-Click Demo Login buttons directly on the Login page or in the navbar menu!)*

### 2. Starting the Servers

#### Backend API (Port 5000):
```bash
cd server
npm start
# or for live reloading:
npm run dev
```

#### Frontend Client (Port 5173):
```bash
cd client
npm run dev
```

Open your browser to: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Route | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Log in & obtain JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user | Private |
| `PUT` | `/api/auth/profile` | Update user profile | Private |

### 🏡 Listings (`/api/listings`)
| Method | Route | Description | Access |
|---|---|---|---|
| `GET` | `/api/listings` | Get listings (filter by category, search, price) | Public |
| `GET` | `/api/listings/:id` | Get listing details, owner & reviews | Public |
| `POST` | `/api/listings` | Create new listing with photo & geocoding | Private |
| `PUT` | `/api/listings/:id` | Update listing | Private (Owner) |
| `DELETE` | `/api/listings/:id` | Delete listing & cascade delete reviews | Private (Owner) |
| `GET` | `/api/listings/user/my-listings` | Get authenticated user's listings | Private |

### ⭐ Reviews (`/api/listings/:id/reviews`)
| Method | Route | Description | Access |
|---|---|---|---|
| `POST` | `/api/listings/:id/reviews` | Post review & update listing rating | Private |
| `DELETE` | `/api/listings/:id/reviews/:reviewId`| Remove review | Private (Author) |

### 📅 Bookings (`/api/bookings`)
| Method | Route | Description | Access |
|---|---|---|---|
| `POST` | `/api/bookings` | Reserve a stay with fee breakdown | Private |
| `GET` | `/api/bookings/my-bookings` | List authenticated user reservations | Private |
| `DELETE` | `/api/bookings/:id` | Cancel reservation | Private |

### 🤖 Smart AI Endpoints (`/api/ai`)
| Method | Route | Description | Access |
|---|---|---|---|
| `POST` | `/api/ai/estimate-budget` | Trip budget & category expense estimator | Public |
| `POST` | `/api/ai/generate-itinerary` | 3 or 5 day personalized travel plan | Public |
| `POST` | `/api/ai/generate-listing-content`| Host title, description & amenities copywriter | Public |


---

## 🗺️ Spatial & Media Architecture
- **GeoJSON Points**: Coordinates are stored as `[longitude, latitude]` and indexed with Mongoose `2dsphere`.
- **Dynamic Maps**: Integrated on both the Listing Detail page and the Homepage Explore Map toggle (`Show map`).
- **Cloudinary / Multer**: Supports direct file upload (`multipart/form-data`) as well as direct image URLs.

---

## 👨‍💻 Author & Credits
Built with ❤️ by **Ankur Yadav** — Full Stack MERN Architecture & Smart AI Integration.

