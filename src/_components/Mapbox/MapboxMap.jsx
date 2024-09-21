import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const GoogleMapPopup = ({ coordinates, onClose }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:"AIzaSyC-Jbo_NrZEm0AP0IB5GxIar4Rpbq7gxlQ",
    libraries: ['marker']
  });

  useEffect(() => {
    console.log("Coordinates changed:", coordinates);
    if (!coordinates || coordinates.length !== 2) {
      console.error("Invalid coordinates:", coordinates);
    } else {
      console.log("Latitude:", coordinates[1], "Longitude:", coordinates[0]);
    }
  }, [coordinates]);

  const onLoad = React.useCallback(function callback(map) {
    console.log("Map loaded successfully");
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    console.log("Map unmounted");
    setMap(null);
  }, []);

  useEffect(() => {
    if (isLoaded && map && coordinates) {
      // Remove existing marker if any
      if (marker) {
        marker.setMap(null);
      }

      // Create new AdvancedMarkerElement
      const { AdvancedMarkerElement } = window.google.maps.marker;
      const newMarker = new AdvancedMarkerElement({
        map,
        position: { lat: coordinates[1], lng: coordinates[0] },
      });

      setMarker(newMarker);
    }
  }, [isLoaded, map, coordinates, marker]);

  if (loadError) {
    console.error("Error loading Google Maps:", loadError);
    return <div className="p-4 text-red-500">Error loading maps. Please check your API key and billing status.</div>;
  }

  if (!isLoaded) {
    console.log("Google Maps API is loading");
    return <div className="p-4">Loading maps...</div>;
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          &times;
        </button>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{lat: coordinates[1], lng: coordinates[0]}}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Marker is now handled in useEffect */}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapPopup;