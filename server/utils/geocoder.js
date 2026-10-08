/**
 * Geocoding Utility
 * Supports Mapbox Geocoding API if MAPBOX_TOKEN is defined,
 * with seamless fallback to OpenStreetMap Nominatim API.
 */

// City coordinates cache/fallback for instant lookup
const fallbackCityCoords = {
  'bali': [115.1889, -8.4095],
  'indonesia': [106.8456, -6.2088],
  'santorini': [25.4615, 36.3932],
  'greece': [23.7275, 37.9838],
  'tokyo': [139.6917, 35.6895],
  'japan': [139.6917, 35.6895],
  'paris': [2.3522, 48.8566],
  'france': [2.3522, 48.8566],
  'zermatt': [7.7491, 45.9765],
  'switzerland': [8.2275, 46.8182],
  'new york': [-74.006, 40.7128],
  'usa': [-95.7129, 37.0902],
  'united states': [-95.7129, 37.0902],
  'amalfi': [14.6027, 40.634],
  'italy': [12.5674, 41.8719],
  'aspen': [-106.8175, 39.1911],
  'colorado': [-105.7821, 39.5501],
  'cape town': [18.4241, -33.9249],
  'south africa': [22.9375, -30.5595],
  'kyoto': [135.7681, 35.0116],
  'london': [-0.1278, 51.5074],
  'united kingdom': [-3.436, 55.3781],
  'mumbai': [72.8777, 19.076],
  'goa': [74.124, 15.2993],
  'india': [78.9629, 20.5937],
  'cancun': [-86.8515, 21.1619],
  'mexico': [-102.5528, 23.6345],
  'queenstown': [168.6626, -45.0312],
  'new zealand': [174.886, -40.9006],
  'tromso': [18.9553, 69.6492],
  'norway': [8.4689, 60.472]
};

const forwardGeocode = async (location, country) => {
  const query = `${location ? location : ''}${country ? ', ' + country : ''}`.trim();
  if (!query) {
    return { type: 'Point', coordinates: [0, 0] };
  }

  // 1. Try Mapbox if token is configured
  const mapboxToken = process.env.MAPBOX_TOKEN;
  if (mapboxToken) {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return { type: 'Point', coordinates: [lng, lat] };
        }
      }
    } catch (err) {
      console.warn('Mapbox geocoding error:', err.message);
    }
  }

  // 2. Try OpenStreetMap Nominatim
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Wanderlust-App/1.0',
      },
    });
    if (response.ok) {
      const results = await response.json();
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        return { type: 'Point', coordinates: [lon, lat] };
      }
    }
  } catch (err) {
    console.warn('Nominatim geocoding error:', err.message);
  }

  // 3. Fallback to dictionary matching
  const lowerQuery = query.toLowerCase();
  for (const [key, coords] of Object.entries(fallbackCityCoords)) {
    if (lowerQuery.includes(key)) {
      return { type: 'Point', coordinates: coords };
    }
  }

  // Generic fallback (e.g. world center or popular destination)
  return { type: 'Point', coordinates: [115.1889, -8.4095] };
};

module.exports = { forwardGeocode };
