import React, { useState, useEffect } from "react";
import {
  Tag,
  Clock,
  Plus,
  X,
  Calendar,
  Percent,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";

const OfferPreferences = () => {
  // Initial state
  const [initialState, setInitialState] = useState({
    categories: ["Food", "Clothing", "Electronics"],
    tags: ["Sale", "New", "Limited", "Featured"],
    defaultExpirationDays: 7,
    defaultDiscount: 10,
    defaultMinPurchase: 0,
    notifyBeforeExpiration: true,
    notifyDaysBeforeExpiration: 1,
    automaticRenewal: false,
  });

  const [offerPreferences, setOfferPreferences] = useState({ ...initialState });

  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const [loadingState, setLoadingState] = useState({
    categories: false,
    tags: false,
    defaultSettings: false,
    expiration: false,
  });

  // Track if sections have pending changes
  const [hasChanges, setHasChanges] = useState({
    categories: false,
    tags: false,
    defaultSettings: false,
    expiration: false,
  });

  // Check for changes when preferences change
  useEffect(() => {
    // Check categories
    const categoriesChanged =
      JSON.stringify(initialState.categories) !==
      JSON.stringify(offerPreferences.categories);

    // Check tags
    const tagsChanged =
      JSON.stringify(initialState.tags) !==
      JSON.stringify(offerPreferences.tags);

    // Check default settings
    const defaultSettingsChanged =
      initialState.defaultExpirationDays !==
        offerPreferences.defaultExpirationDays ||
      initialState.defaultDiscount !== offerPreferences.defaultDiscount ||
      initialState.defaultMinPurchase !== offerPreferences.defaultMinPurchase;

    // Check expiration settings
    const expirationChanged =
      initialState.notifyBeforeExpiration !==
        offerPreferences.notifyBeforeExpiration ||
      initialState.notifyDaysBeforeExpiration !==
        offerPreferences.notifyDaysBeforeExpiration ||
      initialState.automaticRenewal !== offerPreferences.automaticRenewal;

    setHasChanges({
      categories: categoriesChanged,
      tags: tagsChanged,
      defaultSettings: defaultSettingsChanged,
      expiration: expirationChanged,
    });
  }, [offerPreferences, initialState]);

  // Simulated fetch of preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // In a real app, this would be an API call
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For demo purposes, we'll use the default values
        const fetchedData = {
          categories: ["Food", "Clothing", "Electronics"],
          tags: ["Sale", "New", "Limited", "Featured"],
          defaultExpirationDays: 7,
          defaultDiscount: 10,
          defaultMinPurchase: 0,
          notifyBeforeExpiration: true,
          notifyDaysBeforeExpiration: 1,
          automaticRenewal: false,
        };

        setInitialState(fetchedData);
        setOfferPreferences(fetchedData);
      } catch (error) {
        console.error("Error fetching offer preferences:", error);
        toast.error("Failed to load offer preferences");
      }
    };

    fetchPreferences();
  }, []);

  const setLoading = (section, isLoading) => {
    setLoadingState((prev) => ({
      ...prev,
      [section]: isLoading,
    }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (offerPreferences.categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }

    setOfferPreferences((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()],
    }));
    setNewCategory("");
  };

  const handleRemoveCategory = (category) => {
    setOfferPreferences((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (offerPreferences.tags.includes(newTag.trim())) {
      toast.error("Tag already exists");
      return;
    }

    setOfferPreferences((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag("");
  };

  const handleRemoveTag = (tag) => {
    setOfferPreferences((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveCategories = async () => {
    setLoading("categories", true);
    try {
      // In a real app, this would save to an API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state to match current state after successful save
      setInitialState((prev) => ({
        ...prev,
        categories: [...offerPreferences.categories],
      }));

      toast.success("Categories saved successfully!");
    } catch (error) {
      toast.error("Failed to save categories");
    } finally {
      setLoading("categories", false);
    }
  };

  const handleSaveTags = async () => {
    setLoading("tags", true);
    try {
      // In a real app, this would save to an API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state after successful save
      setInitialState((prev) => ({
        ...prev,
        tags: [...offerPreferences.tags],
      }));

      toast.success("Tags saved successfully!");
    } catch (error) {
      toast.error("Failed to save tags");
    } finally {
      setLoading("tags", false);
    }
  };

  const handleSaveDefaultSettings = async () => {
    setLoading("defaultSettings", true);
    try {
      // In a real app, this would save to an API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state after successful save
      setInitialState((prev) => ({
        ...prev,
        defaultExpirationDays: offerPreferences.defaultExpirationDays,
        defaultDiscount: offerPreferences.defaultDiscount,
        defaultMinPurchase: offerPreferences.defaultMinPurchase,
      }));

      toast.success("Default offer settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save default settings");
    } finally {
      setLoading("defaultSettings", false);
    }
  };

  const handleSaveExpirationSettings = async () => {
    setLoading("expiration", true);
    try {
      // In a real app, this would save to an API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state after successful save
      setInitialState((prev) => ({
        ...prev,
        notifyBeforeExpiration: offerPreferences.notifyBeforeExpiration,
        notifyDaysBeforeExpiration: offerPreferences.notifyDaysBeforeExpiration,
        automaticRenewal: offerPreferences.automaticRenewal,
      }));

      toast.success("Expiration settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save expiration settings");
    } finally {
      setLoading("expiration", false);
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Offer Preferences
      </h2>

      {/* Categories Section */}
      <SettingsSection
        title="Default Categories"
        icon={Tag}
        onSave={handleSaveCategories}
        loading={loadingState.categories}
        disabled={!hasChanges.categories}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define categories that will be available when creating new offers
        </p>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {offerPreferences.categories.map((category) => (
              <div
                key={category}
                className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
              >
                <span className="text-gray-800 dark:text-gray-200 text-sm">
                  {category}
                </span>
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="flex-1 px-3 py-2 rounded-lg sm:rounded-r-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2 sm:mb-0"
            />
            <button
              onClick={handleAddCategory}
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg sm:rounded-l-none flex items-center justify-center sm:justify-start"
            >
              <Plus size={18} />
              <span className="ml-1">Add</span>
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Tags Section */}
      <SettingsSection
        title="Default Tags"
        icon={Tag}
        onSave={handleSaveTags}
        loading={loadingState.tags}
        disabled={!hasChanges.tags}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define tags that will be available when creating new offers
        </p>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {offerPreferences.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full"
              >
                <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                  {tag}
                </span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-yellow-600 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="flex-1 px-3 py-2 rounded-lg sm:rounded-r-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2 sm:mb-0"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg sm:rounded-l-none flex items-center justify-center sm:justify-start"
            >
              <Plus size={18} />
              <span className="ml-1">Add</span>
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Default Offer Settings */}
      <SettingsSection
        title="Default Offer Settings"
        icon={Calendar}
        onSave={handleSaveDefaultSettings}
        loading={loadingState.defaultSettings}
        disabled={!hasChanges.defaultSettings}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Expiration (Days)
            </label>
            <div className="flex items-center">
              <Clock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="number"
                name="defaultExpirationDays"
                value={offerPreferences.defaultExpirationDays}
                onChange={handleInputChange}
                min="1"
                max="365"
                className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                days
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Discount Percentage
            </label>
            <div className="flex items-center">
              <Percent className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="number"
                name="defaultDiscount"
                value={offerPreferences.defaultDiscount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="ml-2 text-gray-600 dark:text-gray-400">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Minimum Purchase
            </label>
            <div className="flex items-center">
              <span className="text-gray-400 w-5 h-5 mr-2">$</span>
              <input
                type="number"
                name="defaultMinPurchase"
                value={offerPreferences.defaultMinPurchase}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Set to 0 for no minimum purchase requirement
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* Notifications & Renewal */}
      <SettingsSection
        title="Expiration Settings"
        icon={AlertCircle}
        onSave={handleSaveExpirationSettings}
        loading={loadingState.expiration}
        disabled={!hasChanges.expiration}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                Expiration Notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified before offers expire
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyBeforeExpiration"
                checked={offerPreferences.notifyBeforeExpiration}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
            </label>
          </div>

          {offerPreferences.notifyBeforeExpiration && (
            <div className="ml-0 sm:ml-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notify Days Before Expiration
              </label>
              <input
                type="number"
                name="notifyDaysBeforeExpiration"
                value={offerPreferences.notifyDaysBeforeExpiration}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                  Automatic Offer Renewal
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically renew offers when they expire
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="automaticRenewal"
                  checked={offerPreferences.automaticRenewal}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Rule Templates */}
      <SettingsSection title="Offer Rule Templates" icon={Calendar}>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Create and save offer rule templates to quickly apply to new offers
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center sm:text-left">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This is a premium feature. Upgrade your plan to create custom rule
              templates.
            </p>
            <button
              className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
              onClick={() => toast.info("Upgrade feature would open here")}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default OfferPreferences;
