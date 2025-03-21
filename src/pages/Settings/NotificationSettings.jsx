import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Save } from "lucide-react";
import { toast } from "react-toastify";

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    orders: true,
    marketing: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real application, you would save these settings to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      toast.success("Notification settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save notification settings");
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
          Notification Settings
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

      <SettingsSection title="Notifications" icon={Bell}>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {key} Notifications
              </span>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`relative inline-flex h-1 w-15 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                  value ? "bg-yellow-500" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <motion.div
                  animate={{ x: value ? 20 : -20 }}
                  className="w-8 h-8 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
};

export default NotificationSettings;
