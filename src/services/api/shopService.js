import { apiRequest, getAuthToken } from "./apiClient";

/**
 * Get the current shop ID from the JWT token
 */
export const getCurrentShopId = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.shopId;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Get shop details
 */
export const getShopDetails = async () => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  return apiRequest(`/shops/${shopId}`);
};

/**
 * Update shop location
 */
export const updateShopLocation = async (locationData) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  // Convert location to GeoJSON format if provided
  const shopData = {
    address: locationData.address,
  };

  if (locationData.location) {
    shopData.location = {
      type: "Point",
      coordinates: [locationData.location.lng, locationData.location.lat],
    };
  }

  return apiRequest(`/shops/${shopId}/location`, "PUT", shopData);
};

/**
 * Get shop location
 */
export const getShopLocation = async () => {
  const shopData = await getShopDetails();

  // Transform the GeoJSON format to an easier to use format for our frontend
  const location = shopData.data.location?.coordinates
    ? {
        latitude: shopData.data.location.coordinates[1],
        longitude: shopData.data.location.coordinates[0],
      }
    : null;

  return {
    address: shopData.data.address || "",
    location: location,
  };
};

/**
 * Update shop basic info
 */
export const updateShopBasicInfo = async (basicInfo) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  const shopData = {
    name: basicInfo.shopName,
    description: basicInfo.description,
    category: basicInfo.category,
  };

  return apiRequest(`/shops/${shopId}`, "PUT", shopData);
};

/**
 * Update shop business hours
 */
export const updateShopBusinessHours = async (businessHours) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  const shopData = {
    businessHours: businessHours,
  };

  return apiRequest(`/shops/${shopId}`, "PUT", shopData);
};

/**
 * Update shop images (logo and cover image)
 */
export const updateShopImages = async (images) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  const shopData = {
    logo: images.logo,
    coverImage: images.coverImage,
  };

  return apiRequest(`/shops/${shopId}`, "PUT", shopData);
};

/**
 * Update shop contact information
 */
export const updateShopContactInfo = async (contactInfo) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  const shopData = {
    phone: contactInfo.phone,
    email: contactInfo.email,
    website: contactInfo.website,
  };

  return apiRequest(`/shops/${shopId}`, "PUT", shopData);
};

/**
 * Update shop social links
 */
export const updateShopSocialLinks = async (socialLinks) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  const shopData = {
    socialLinks: socialLinks,
  };

  return apiRequest(`/shops/${shopId}`, "PUT", shopData);
};
