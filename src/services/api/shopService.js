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
export const updateShop = async (endpoint, shopData) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }


  return apiRequest(`/shops/${shopId}/${endpoint}`, "PUT", shopData);
};
