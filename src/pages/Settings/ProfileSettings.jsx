import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Globe,
  Phone,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";
import LocationPicker from "../../components/LocationPicker";
import BusinessHoursEditor from "../../components/settings/BusinessHoursEditor";
import ImageUploader from "../../components/settings/ImageUploader";
import { getShopLocation, updateShop } from "../../services/api/shopService";

const ProfileSettings = () => {
  // Initial state to compare against for changes
  const [initialProfileData, setInitialProfileData] = useState({
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

  // Current state that can be modified
  const [profileData, setProfileData] = useState({ ...initialProfileData });

  // Track loading states for each section
  const [loadingState, setLoadingState] = useState({
    basicInfo: false,
    businessHours: false,
    images: false,
    contactInfo: false,
    socialLinks: false,
    location: false,
  });

  // Track if each section has changes
  const [hasChanges, setHasChanges] = useState({
    basicInfo: false,
    businessHours: false,
    images: false,
    contactInfo: false,
    socialLinks: false,
    location: false,
  });

  // Check for changes in different sections
  useEffect(() => {
    // Check basic info
    const basicInfoChanged =
      initialProfileData.shopName !== profileData.shopName ||
      initialProfileData.description !== profileData.description ||
      initialProfileData.category !== profileData.category;

    // Check business hours
    const businessHoursChanged =
      JSON.stringify(initialProfileData.businessHours) !==
      JSON.stringify(profileData.businessHours);

    // Check images
    const imagesChanged =
      initialProfileData.logo !== profileData.logo ||
      initialProfileData.coverImage !== profileData.coverImage;

    // Check contact info
    const contactInfoChanged =
      initialProfileData.email !== profileData.email ||
      initialProfileData.phone !== profileData.phone ||
      initialProfileData.website !== profileData.website;

    // Check social links
    const socialLinksChanged =
      JSON.stringify(initialProfileData.socialLinks) !==
      JSON.stringify(profileData.socialLinks);

    // Check location
    const locationChanged =
      JSON.stringify(initialProfileData.location) !==
        JSON.stringify(profileData.location) ||
      initialProfileData.address !== profileData.address;

    setHasChanges({
      basicInfo: basicInfoChanged,
      businessHours: businessHoursChanged,
      images: imagesChanged,
      contactInfo: contactInfoChanged,
      socialLinks: socialLinksChanged,
      location: locationChanged,
    });
  }, [profileData, initialProfileData]);

  useEffect(() => {
    fetchShopDetails();
  }, []);

  // Fetch shop details and set both current and initial state
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

        // Use the location service to get location data
        const locationData = await getShopLocation();

        const fetchedData = {
          shopName: shop.data.name || "",
          description: shop.data.description || "",
          category: shop.data.category || "",
          email: decodedToken.email || "",
          address: locationData.address,
          phone: decodedToken.phone || "",
          website: shop.data.website || "",
          socialLinks: shop.data.socialLinks || {
            facebook: "",
            instagram: "",
            twitter: "",
          },
          location: locationData.location,
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
        };

        setInitialProfileData(fetchedData);
        setProfileData(fetchedData);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    }
  };

  const setLoading = (section, isLoading) => {
    setLoadingState((prev) => ({
      ...prev,
      [section]: isLoading,
    }));
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

  const handleSaveBasicInfo = async () => {
    setLoading("basicInfo", true);
    try {
      const shopData = {
        name: profileData.shopName,
        description: profileData.description,
        category: profileData.category,
      };

      const data = await updateShop("/", shopData);

      if (data.success) {
        // Update initial state after successful save
        setInitialProfileData((prev) => ({
          ...prev,
          shopName: profileData.shopName,
          description: profileData.description,
          category: profileData.category,
        }));

        toast.success("Shop details saved successfully!");
      } else {
        toast.error(data.message || "Failed to save shop details");
      }
    } catch (error) {
      console.error("Error saving shop details:", error);
      toast.error("Failed to save shop details");
    } finally {
      setLoading("basicInfo", false);
    }
  };

  const handleSaveBusinessHours = async () => {
    setLoading("businessHours", true);
    try {
      const shopData = {
        businessHours: profileData.businessHours,
      };

      const data = await updateShop("business-hours", shopData);

      if (data.success) {
        // Update initial state after successful save
        setInitialProfileData((prev) => ({
          ...prev,
          businessHours: profileData.businessHours,
        }));

        toast.success("Business hours saved successfully!");
      } else {
        toast.error(data.message || "Failed to save business hours");
      }
    } catch (error) {
      console.error("Error saving business hours:", error);
      toast.error("Failed to save business hours");
    } finally {
      setLoading("businessHours", false);
    }
  };

  const handleSaveImages = async () => {
    setLoading("images", true);
    try {
      const shopData = {
        logo: profileData.logo,
        coverImage: profileData.coverImage,
      };

      const data = await updateShop("cover-image", shopData);

      if (data.success) {
        // Update initial state after successful save
        setInitialProfileData((prev) => ({
          ...prev,
          logo: profileData.logo,
          coverImage: profileData.coverImage,
        }));

        toast.success("Shop images saved successfully!");
      } else {
        toast.error(data.message || "Failed to save shop images");
      }
    } catch (error) {
      console.error("Error saving shop images:", error);
      toast.error("Failed to save shop images");
    } finally {
      setLoading("images", false);
    }
  };

  const handleSaveContactInfo = async () => {
    setLoading("contactInfo", true);
    try {
      const shopData = {
        phone: profileData.phone,
        email: profileData.email,
        website: profileData.website,
      };

      const data = await updateShop(shopData);

      if (data.success) {
        // Update initial state after successful save
        setInitialProfileData((prev) => ({
          ...prev,
          phone: profileData.phone,
          email: profileData.email,
          website: profileData.website,
        }));

        toast.success("Contact information saved successfully!");
      } else {
        toast.error(data.message || "Failed to save contact information");
      }
    } catch (error) {
      console.error("Error saving contact information:", error);
      toast.error("Failed to save contact information");
    } finally {
      setLoading("contactInfo", false);
    }
  };

  const handleSaveSocialLinks = async () => {
    setLoading("socialLinks", true);
    try {
      const shopData = {
        socialLinks: profileData.socialLinks,
      };

      const data = await updateShop(shopData);

      if (data.success) {
        // Update initial state after successful save
        setInitialProfileData((prev) => ({
          ...prev,
          socialLinks: profileData.socialLinks,
        }));

        toast.success("Social links saved successfully!");
      } else {
        toast.error(data.message || "Failed to save social links");
      }
    } catch (error) {
      console.error("Error saving social links:", error);
      toast.error("Failed to save social links");
    } finally {
      setLoading("socialLinks", false);
    }
  };

  const handleSaveLocation = async () => {
    setLoading("location", true);
    try {
      const locationData = {
        address: profileData.address,
        location: profileData.location,
      };

      const data = await updateShop("location", locationData);

      if (data.success) {
        // Update initial state after successful save
        setInitialProfileData((prev) => ({
          ...prev,
          address: profileData.address,
          location: profileData.location,
        }));

        toast.success("Location information saved successfully!");
      } else {
        toast.error(data.message || "Failed to save location information");
      }
    } catch (error) {
      console.error("Error saving location information:", error);
      toast.error("Failed to save location information");
    } finally {
      setLoading("location", false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Business Profile
      </h2>

      {/* Basic Shop Details */}
      <SettingsSection
        title="Shop Details"
        icon={Store}
        onSave={handleSaveBasicInfo}
        loading={loadingState.basicInfo}
        disabled={!hasChanges.basicInfo}
      >
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
              <option value="Retail">Retail</option>
              <option value="Food">Food</option>
              <option value="Services">Services</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Fashion">Fashion</option>
              <option value="Health">Health</option>
              <option value="Beauty">Beauty</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* Business Hours */}
      <SettingsSection
        title="Business Hours"
        icon={Store}
        onSave={handleSaveBusinessHours}
        loading={loadingState.businessHours}
        disabled={!hasChanges.businessHours}
      >
        <BusinessHoursEditor
          businessHours={profileData.businessHours}
          onChange={handleBusinessHoursChange}
        />
      </SettingsSection>

      {/* Logo & Cover Image */}
      <SettingsSection
        title="Shop Images"
        icon={Store}
        onSave={handleSaveImages}
        loading={loadingState.images}
        disabled={!hasChanges.images}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo
            </label>
            <ImageUploader
              imageType="logo"
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
              imageType="coverImage"
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
      <SettingsSection
        title="Contact Information"
        icon={Phone}
        onSave={handleSaveContactInfo}
        loading={loadingState.contactInfo}
        disabled={!hasChanges.contactInfo}
      >
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
      <SettingsSection
        title="Social Media Links"
        icon={Globe}
        onSave={handleSaveSocialLinks}
        loading={loadingState.socialLinks}
        disabled={!hasChanges.socialLinks}
      >
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
      <SettingsSection
        title="Shop Location"
        icon={MapPin}
        onSave={handleSaveLocation}
        loading={loadingState.location}
        disabled={!hasChanges.location}
      >
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
