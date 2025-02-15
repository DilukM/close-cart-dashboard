import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Store,
  Bell,
  Shield,
  Palette,
  Mail,
  Key,
  MapPin,
  Save,
  Globe,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      orders: true,
      marketing: false,
    },
    appearance: {
      language: "English",
      timeZone: "UTC+00:00",
      currency: "USD",
    },
  });

  const [profileData, setProfileData] = useState({
    shopName: "LUK corp",
    email: "diluk@gmail.com",
    address: "No.122, Kawudella",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleNotificationChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection title="Security" icon={Shield}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="password"
                value={profileData.password}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon={Bell}>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {key} Notifications
                </span>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? "bg-yellow-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <motion.div
                    animate={{ x: value ? 24 : 0 }}
                    className="w-6 h-6 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences" icon={Palette}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      language: e.target.value,
                    },
                  }))
                }
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
                value={settings.appearance.timeZone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      timeZone: e.target.value,
                    },
                  }))
                }
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
                value={settings.appearance.currency}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      currency: e.target.value,
                    },
                  }))
                }
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
    </div>
  );
};

export default Settings;
