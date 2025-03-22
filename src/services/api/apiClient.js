/**
 * Base API client for making HTTP requests
 */
const API_BASE_URL = "https://closecart-backend.vercel.app/api/v1";

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Generic request function with authentication
export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Something went wrong");
    }

    return responseData;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};
