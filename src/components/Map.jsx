import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Need to fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Map = ({ location, onLocationChange, height = "300px" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Default location if none provided
  const defaultLocation = { lat: 0, lng: 0 };
  const mapLocation = location || defaultLocation;

  useEffect(() => {
    // Initialize map only once when component mounts
    if (!mapInstanceRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [mapLocation.lat, mapLocation.lng],
        13
      );

      // Add OpenStreetMap tile layer (free)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Create marker if location exists
      if (location) {
        markerRef.current = L.marker([location.lat, location.lng], {
          draggable: true,
        }).addTo(mapInstanceRef.current);

        // Add drag end event
        markerRef.current.on("dragend", function () {
          const position = markerRef.current.getLatLng();
          const newLocation = {
            lat: position.lat,
            lng: position.lng,
          };
          onLocationChange(newLocation);
        });
      }

      // Add click event to map
      mapInstanceRef.current.on("click", function (e) {
        const clickedLocation = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setLatLng([
            clickedLocation.lat,
            clickedLocation.lng,
          ]);
        } else {
          markerRef.current = L.marker(
            [clickedLocation.lat, clickedLocation.lng],
            {
              draggable: true,
            }
          ).addTo(mapInstanceRef.current);

          markerRef.current.on("dragend", function () {
            const position = markerRef.current.getLatLng();
            const newLocation = {
              lat: position.lat,
              lng: position.lng,
            };
            onLocationChange(newLocation);
          });
        }

        onLocationChange(clickedLocation);
      });
    }

    // Clean up function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update marker position when location prop changes
  useEffect(() => {
    if (mapInstanceRef.current && location && location.lat && location.lng) {
      // Update map center
      mapInstanceRef.current.setView([location.lat, location.lng], 13);

      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([location.lat, location.lng]);
      } else {
        markerRef.current = L.marker([location.lat, location.lng], {
          draggable: true,
        }).addTo(mapInstanceRef.current);

        markerRef.current.on("dragend", function () {
          const position = markerRef.current.getLatLng();
          const newLocation = {
            lat: position.lat,
            lng: position.lng,
          };
          onLocationChange(newLocation);
        });
      }
    }
  }, [location, onLocationChange]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
      <div ref={mapRef} style={{ height }} className="w-full" />
    </div>
  );
};

export default Map;
