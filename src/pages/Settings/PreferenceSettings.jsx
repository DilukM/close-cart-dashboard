import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Save } from "lucide-react";
import { toast } from "react-toastify";

const PreferenceSettings = () => {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    language: "English",
    timeZone: "UTC+00:00",
    currency: "USD",
  });

  const handlePreferenceChange = (e) => {
    setPreferences((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real application, you would save these settings to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      toast.success("Preference settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save preference settings");
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
          Preference Settings
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

      <SettingsSection title="Preferences" icon={Palette}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select
              name="language"
              value={preferences.language}
              onChange={handlePreferenceChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Zone
            </label>
            <select
              name="timeZone"
              value={preferences.timeZone}
              onChange={handlePreferenceChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option>UTC+00:00</option>
              <option>UTC+01:00</option>
              <option>UTC+02:00</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={preferences.currency}
              onChange={handlePreferenceChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default PreferenceSettings;
