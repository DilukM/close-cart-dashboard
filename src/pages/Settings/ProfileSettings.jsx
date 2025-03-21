import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Store, MapPin, Save } from "lucide-react";
import { toast } from "react-toastify";
import LocationPicker from "../../components/LocationPicker";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    shopName: "",
    email: "",
    address: "",
    phone: "",
    location: null,
  });

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken) {
        try {
          const shopResponse = await fetch(
            `https://closecart-backend.vercel.app/api/v1/shops/${decodedToken.shopId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const shop = await shopResponse.json();
          console.log(shop);

          // Check if location coordinates exist in the shop data
          const location = shop.data.location?.coordinates
            ? {
                lat: shop.data.location.coordinates[1],
                lng: shop.data.location.coordinates[0],
              }
            : null;

          setProfileData({
            shopName: shop.data.name || "",
            email: decodedToken.email || "",
            address: shop.data.address || "",
            phone: decodedToken.phone || "",
            location: location,
          });
        } catch (error) {
          console.error("Error fetching shop details:", error);
        }
      }
    }
  };

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLocationChange = (newLocation) => {
    setProfileData((prev) => ({
      ...prev,
      location: newLocation,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Prepare location data in GeoJSON format required by backend
      const locationData = profileData.location
        ? {
            type: "Point",
            coordinates: [profileData.location.lng, profileData.location.lat],
          }
        : undefined;

      // Create data object to send
      const shopData = {
        name: profileData.shopName,
        address: profileData.address,
        location: locationData,
      };

      // Send updated data to server
      const response = await fetch(
        `https://closecart-backend.vercel.app/api/v1/shops/${decodedToken.shopId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shopData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Profile settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save profile settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>

      {/* Profile Settings */}
      <SettingsSection title="Shop Profile" icon={Store}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={profileData.shopName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shop Address
            </label>
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              rows="3"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Location Picker */}
      <SettingsSection title="Shop Location" icon={MapPin}>
        <LocationPicker
          initialLocation={profileData.location}
          onLocationChange={handleLocationChange}
        />
      </SettingsSection>
    </div>
  );
};

export default ProfileSettings;
