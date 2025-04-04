import { apiRequest } from "./apiClient";
import { getCurrentShopId } from "./shopService";

/**
 * Get available categories for offers
 */
export const getAvailableCategories = async () => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  try {
    // In a real app, this would be an API endpoint
    // return apiRequest(`/shops/${shopId}/offer-categories`);

    // For now, return mock data
    return {
      success: true,
      data: [
        "Food",
        "Clothing",
        "Electronics",
        "Home & Garden",
        "Beauty",
        "Sports",
        "Books",
        "Toys",
        "Other",
      ],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [] };
  }
};

/**
 * Get recommended tags for offers
 */
export const getRecommendedTags = async () => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  try {
    // In a real app, this would be an API endpoint
    // return apiRequest(`/shops/${shopId}/offer-tags`);

    // For now, return mock data
    return {
      success: true,
      data: [
        "Sale",
        "New",
        "Limited Time",
        "Clearance",
        "Seasonal",
        "Featured",
        "Flash Sale",
        "Special",
        "Bestseller",
      ],
    };
  } catch (error) {
    console.error("Error fetching recommended tags:", error);
    return { success: false, data: [] };
  }
};

/**
 * Create a new offer
 */
export const createOffer = async (offerData) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }
  console.log(offerData);
  return apiRequest(`/shops/${shopId}/offers`, "POST", offerData);
};

/**
 * Update an existing offer
 */
export const updateOffer = async (offerId, offerData) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  return apiRequest(`/shops/${shopId}/offers/${offerId}`, "PUT", offerData);
};

/**
 * Delete an offer
 */
export const deleteOffer = async (offerId) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  return apiRequest(`/shops/${shopId}/offers/${offerId}`, "DELETE");
};

/**
 * Create a new offer with loading state management
 */
export const createOfferWithLoading = async (offerData, setIsLoading) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  setIsLoading(true);
  try {
    const response = await apiRequest(`/offers`, "POST", offerData);
    return response;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Update an existing offer with loading state management
 */
export const updateOfferWithLoading = async (
  offerId,
  offerData,
  setIsLoading
) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  setIsLoading(true);
  try {
    const response = await apiRequest(`/offers/${offerId}`, "PUT", offerData);
    return response;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Delete an offer with loading state management
 */
export const deleteOfferWithLoading = async (offerId, setIsLoading) => {
  const shopId = getCurrentShopId();
  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  setIsLoading(true);
  try {
    const response = await apiRequest(`/offers/${offerId}`, "DELETE");
    return response;
  } finally {
    setIsLoading(false);
  }
};
