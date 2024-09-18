// src/components/MapPopup.js

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS

const MapPopup = ({ coordinates, onClose }) => {
  const mapContainer = useRef(null); // Reference to the map container

  useEffect(() => {
    if (!coordinates) return; // Return if no coordinates

    // Initialize Mapbox map
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hdGg0NTQ1IiwiYSI6ImNtMTdtNXJseDB0emIya3M4eDQ2NTU0cnkifQ.jkCDiJD2DivJDQMp9WWDog';
    const map = new mapboxgl.Map({
      container: mapContainer.current, // Container ID from the ref
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: coordinates, // Initial map center
      zoom: 12 // Initial zoom level
    });

    // Add a marker to the map
    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map);

    // Clean up map instance on unmount
    return () => map.remove();
  }, [coordinates]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          &times;
        </button>
        <div ref={mapContainer} style={{ height: '400px' }} />
      </div>
    </div>
  );
};

export default MapPopup;
