import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Save,
  Globe,
  Phone,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";
import SaveButton from "../../components/settings/SaveButton";
import LocationPicker from "../../components/LocationPicker";
import BusinessHoursEditor from "../../components/settings/BusinessHoursEditor";
import ImageUploader from "../../components/settings/ImageUploader";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    shopName: "",
    description: "",
    category: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    location: null,
    businessHours: {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "10:00", close: "15:00", isOpen: true },
      sunday: { open: "10:00", close: "15:00", isOpen: false },
    },
    logo: null,
    coverImage: null,
  });

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
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

        // Check if location coordinates exist in the shop data
        const location = shop.data.location?.coordinates
          ? {
              lat: shop.data.location.coordinates[1],
              lng: shop.data.location.coordinates[0],
            }
          : null;

        setProfileData({
          shopName: shop.data.name || "",
          description: shop.data.description || "",
          category: shop.data.category || "",
          email: decodedToken.email || "",
          address: shop.data.address || "",
          phone: decodedToken.phone || "",
          website: shop.data.website || "",
          socialLinks: shop.data.socialLinks || {
            facebook: "",
            instagram: "",
            twitter: "",
          },
          location: location,
          businessHours: shop.data.businessHours || {
            monday: { open: "09:00", close: "17:00", isOpen: true },
            tuesday: { open: "09:00", close: "17:00", isOpen: true },
            wednesday: { open: "09:00", close: "17:00", isOpen: true },
            thursday: { open: "09:00", close: "17:00", isOpen: true },
            friday: { open: "09:00", close: "17:00", isOpen: true },
            saturday: { open: "10:00", close: "15:00", isOpen: true },
            sunday: { open: "10:00", close: "15:00", isOpen: false },
          },
          logo: shop.data.logo || null,
          coverImage: shop.data.coverImage || null,
        });
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (newLocation) => {
    setProfileData((prev) => ({
      ...prev,
      location: newLocation,
    }));
  };

  const handleBusinessHoursChange = (updatedHours) => {
    setProfileData((prev) => ({
      ...prev,
      businessHours: updatedHours,
    }));
  };

  const handleImageUpload = (type, imageUrl) => {
    setProfileData((prev) => ({
      ...prev,
      [type]: imageUrl,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Prepare location data in GeoJSON format
      const locationData = profileData.location
        ? {
            type: "Point",
            coordinates: [profileData.location.lng, profileData.location.lat],
          }
        : undefined;

      // Create data object to send
      const shopData = {
        name: profileData.shopName,
        description: profileData.description,
        category: profileData.category,
        address: profileData.address,
        website: profileData.website,
        socialLinks: profileData.socialLinks,
        location: locationData,
        businessHours: profileData.businessHours,
        logo: profileData.logo,
        coverImage: profileData.coverImage,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Business Profile
        </h2>
        <SaveButton onClick={handleSave} loading={loading} />
      </div>

      {/* Basic Shop Details */}
      <SettingsSection title="Shop Details" icon={Store}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={profileData.shopName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shop Description
            </label>
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Category
            </label>
            <select
              name="category"
              value={profileData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="retail">Retail</option>
              <option value="food">Food & Beverage</option>
              <option value="services">Services</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="health">Health & Wellness</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* Business Hours */}
      <SettingsSection title="Business Hours" icon={Store}>
        <BusinessHoursEditor
          businessHours={profileData.businessHours}
          onChange={handleBusinessHoursChange}
        />
      </SettingsSection>

      {/* Logo & Cover Image */}
      <SettingsSection title="Shop Images" icon={Store}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo
            </label>
            <ImageUploader
              currentImage={profileData.logo}
              onImageUpload={(imageUrl) => handleImageUpload("logo", imageUrl)}
              aspectRatio={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            <ImageUploader
              currentImage={profileData.coverImage}
              onImageUpload={(imageUrl) =>
                handleImageUpload("coverImage", imageUrl)
              }
              aspectRatio={16 / 9}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Contact Information */}
      <SettingsSection title="Contact Information" icon={Phone}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
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
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={profileData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Social Links */}
      <SettingsSection title="Social Media Links" icon={Globe}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Facebook
            </label>
            <input
              type="url"
              name="facebook"
              value={profileData.socialLinks.facebook}
              onChange={handleSocialLinkChange}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              value={profileData.socialLinks.instagram}
              onChange={handleSocialLinkChange}
              placeholder="https://instagram.com/youraccount"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Twitter
            </label>
            <input
              type="url"
              name="twitter"
              value={profileData.socialLinks.twitter}
              onChange={handleSocialLinkChange}
              placeholder="https://twitter.com/youraccount"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Shop Location */}
      <SettingsSection title="Shop Location" icon={MapPin}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Map Location (Click to set your shop location)
            </label>
            <LocationPicker
              initialLocation={profileData.location}
              onLocationChange={handleLocationChange}
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default ProfileSettings;
