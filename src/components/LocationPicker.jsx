import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, X } from "lucide-react";
import Map from "./Map";
import { getCurrentLocation, getAddressFromCoords } from "../utils/MapHelper";
import debounce from "lodash/debounce";

const LocationPicker = ({ initialLocation, onLocationChange }) => {
  const [location, setLocation] = useState(initialLocation || null);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const resultsContainerRef = useRef(null);

  // Handle clicks outside search results to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        resultsContainerRef.current &&
        !resultsContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    }
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update address when location changes
  useEffect(() => {
    if (location) {
      const fetchAddress = async () => {
        try {
          const addressString = await getAddressFromCoords(location);
          setAddress(addressString);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };

      fetchAddress();
    }
  }, [location]);

  // Fetch address for initial location when component mounts
  useEffect(() => {
    const fetchInitialAddress = async () => {
      if (initialLocation) {
        try {
          const addressString = await getAddressFromCoords(initialLocation);
          setAddress(addressString);
        } catch (error) {
          console.error("Error fetching initial address:", error);
        }
      }
    };

    fetchInitialAddress();
  }, [initialLocation]);

  // Create debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use Nominatim API for geocoding (free and no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5`,
          {
            headers: {
              "Accept-Language": "en", // Prefer English results
              "User-Agent": "CloseCart Dashboard", // Identify app as required by OSM policy
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setSearchResults(
            data.map((result) => ({
              id: result.place_id,
              address: result.display_name,
              location: {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
              },
            }))
          );
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error searching for location:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500)
  ).current;

  // Handle location change from map
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    onLocationChange(newLocation);
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      console.log("Current location:", currentLocation);
      setLocation(currentLocation);
      onLocationChange(currentLocation);
    } catch (error) {
      console.error("Error getting current location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Select a search result
  const handleSelectResult = (result) => {
    setLocation(result.location);
    setAddress(result.address);
    setSearchQuery(result.address);
    setShowResults(false);
    onLocationChange(result.location);
  };

  return (
    <div className="space-y-4">
      {/* Search section with higher stacking context */}
      <div
        className="relative"
        ref={resultsContainerRef}
        style={{ zIndex: 9999 }} // Very high z-index
      >
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Location
          </label>
        </div>
        <div className="relative flex">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for a location"
              className="w-full pl-10 pr-10 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowResults(false);
                }}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Search results dropdown - Using fixed positioning for guaranteed overlay */}
        {showResults && searchResults.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%", // Position below the search input
              left: 0,
              right: 0,
              zIndex: 9999, // Very high z-index
              maxHeight: "240px",
              overflowY: "auto",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              backgroundColor: "white", // Light mode background
            }}
            className="mt-1 rounded-md dark:bg-gray-800"
          >
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-start gap-2"
                onClick={() => handleSelectResult(result)}
              >
                <MapPin className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                <span className="text-gray-800 dark:text-gray-200 text-sm">
                  {result.address}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current location button */}
      <div className="relative" style={{ zIndex: 1 }}>
        <button
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
          disabled={isLoading}
        >
          <Navigation className="h-4 w-4" />
          {isLoading ? "Getting location..." : "Use my current location"}
        </button>
      </div>

      {/* Map with lower z-index */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Map
          location={location}
          onLocationChange={handleLocationChange}
          height="300px"
        />
      </div>

      {/* Current address display - now always visible */}
      <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selected Location
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {address || "No location selected"}
            </span>
            {location && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
