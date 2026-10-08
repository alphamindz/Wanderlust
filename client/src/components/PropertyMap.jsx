import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const PropertyMap = ({ coordinates, title, location, country }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Default coordinates: [longitude, latitude] -> Leaflet uses [latitude, longitude]
  const lng = coordinates && coordinates[0] ? coordinates[0] : 115.1889;
  const lat = coordinates && coordinates[1] ? coordinates[1] : -8.4095;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if re-rendering
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 13,
        scrollWheelZoom: false,
      });

      // CartoDB Voyager tiles for modern, clean vector-style map tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom Wanderlust SVG Pin Marker
      const customPinIcon = L.divIcon({
        className: 'custom-map-pin-icon',
        html: `
          <div style="
            background: linear-gradient(135deg, #FF385C 0%, #E00B41 100%);
            width: 44px;
            height: 44px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(255, 56, 92, 0.4);
            border: 2px solid #FFFFFF;
            cursor: pointer;
          ">
            <svg style="transform: rotate(45deg); width: 22px; height: 22px; color: #FFF;" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -46],
      });

      const marker = L.marker([lat, lng], { icon: customPinIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 180px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 4px;">${title}</h4>
          <p style="font-size: 0.85rem; color: #6B7280; margin: 0;">${location}, ${country}</p>
          <div style="margin-top: 6px; font-size: 0.75rem; color: #FF385C; font-weight: 600;">
            Exact coordinates provided upon booking
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml).openPopup();
      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Error initializing map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, title, location, country]);

  return (
    <div className="map-container-box" id="listing-map-section">
      <h3 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>Where you'll be</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        {location}, {country}
      </p>

      <div
        ref={mapContainerRef}
        className="map-viewport"
        id="interactive-map-viewport"
      ></div>
    </div>
  );
};

export default PropertyMap;
