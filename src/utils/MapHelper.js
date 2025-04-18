/**
 * Utility functions for map and location handling with OpenStreetMap
 */

/**
 * Gets the user's current location using the browser's Geolocation API
 * @returns {Promise} A promise that resolves with the coordinates {lat, lng}
 */
/**
 * Gets the user's current location using the browser's Geolocation API with improved accuracy
 * @returns {Promise} A promise that resolves with the coordinates {lat, lng}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      // Show loading state while getting location
      const loadingToastId = showLoadingToast("Getting your location...");

      // Use high accuracy settings for better results
      // This might ask for additional permissions on mobile devices
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Hide loading toast and show success
          hideLoadingToast(loadingToastId);

          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy, // in meters
          };

          // If accuracy is too low (>100 meters), warn the user
          if (position.coords.accuracy > 100) {
            showWarningToast(
              "Location obtained with low accuracy. You may want to try again or manually select your location."
            );
          }

          resolve(location);
        },
        (error) => {
          // Hide loading toast and show error
          hideLoadingToast(loadingToastId);

          // Provide more user-friendly error messages
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location permission denied. Please enable location services in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                "Location information is unavailable. Try again or select location manually.";
              break;
            case error.TIMEOUT:
              errorMessage =
                "Location request timed out. Try again or select location manually.";
              break;
            default:
              errorMessage =
                "An unknown error occurred while getting your location.";
          }

          showErrorToast(errorMessage);
          reject(new Error(errorMessage));
        },
        // Options for better accuracy:
        {
          enableHighAccuracy: true, // Request the best possible results
          timeout: 10000, // Wait up to 10 seconds (increased from 5s)
          maximumAge: 0, // Don't use cached position data
        }
      );
    }
  });
};

// Helper functions for toast notifications
const showLoadingToast = (message) => {
  // If you're using a toast library like react-toastify:
  // return toast.loading(message);

  // For now, just log to console:
  console.log(message);
  return Date.now(); // Return a unique ID
};

const hideLoadingToast = (id) => {
  // If you're using a toast library:
  // toast.dismiss(id);

  // For now, just log to console:
  console.log("Loading complete");
};

const showErrorToast = (message) => {
  // If you're using a toast library:
  // toast.error(message);

  // For now, just log to console:
  console.error(message);
};

const showWarningToast = (message) => {
  // If you're using a toast library:
  // toast.warn(message);

  // For now, just log to console:
  console.warn(message);
};

/**
 * Converts coordinates to an address using OpenStreetMap's Nominatim reverse geocoding
 * @param {Object} location - The location object with lat and lng properties
 * @returns {Promise} A promise that resolves with the address string
 */
export const getAddressFromCoords = async (location) => {
  try {
    // Make sure to follow Nominatim usage policy:
    // 1. Add meaningful user agent
    // 2. Maximum 1 request per second
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "CloseCart Dashboard Application", // Identify your application
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    }
    return "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};

/**
 * Converts an address to coordinates using OpenStreetMap's Nominatim geocoding
 * @param {String} address - The address to geocode
 * @returns {Promise} A promise that resolves with the coordinates {lat, lng}
 */
export const getCoordsFromAddress = async (address) => {
  try {
    // Make sure to follow Nominatim usage policy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "CloseCart Dashboard Application", // Identify your application
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    throw new Error("Location not found");
  } catch (error) {
    console.error("Error geocoding address:", error);
    throw error;
  }
};

/**
 * Add throttling to ensure we don't exceed Nominatim usage limits (max 1 request per second)
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;

  return function (...args) {
    const context = this;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);

      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/**
 * Creates a cache for geocoding results to reduce API calls
 * @param {Function} fn - Function to cache
 * @param {Number} ttl - Time to live in milliseconds
 * @returns {Function} Cached function
 */
export const createGeoCache = (fn, ttl = 24 * 60 * 60 * 1000) => {
  const cache = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && cached.timestamp > Date.now() - ttl) {
      return cached.value;
    }

    const result = await fn.apply(this, args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
};

// Apply throttling and caching to the geocoding functions
export const getCachedAddressFromCoords = createGeoCache(
  throttle(getAddressFromCoords, 1100)
);

export const getCachedCoordsFromAddress = createGeoCache(
  throttle(getCoordsFromAddress, 1100)
);
