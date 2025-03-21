import React, { useState } from "react";
import {
  Bell,
  Save,
  ShoppingBag,
  TrendingUp,
  MessageCircle,
  Mail,
  Smartphone,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";
import SaveButton from "../../components/settings/SaveButton";

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    // Order notifications
    newOrder: true,
    orderUpdates: true,
    orderCancellations: true,

    // Ad performance
    lowEngagement: true,
    budgetAlerts: true,
    campaignEnding: false,

    // Customer messages
    customerChat: true,
    customerReviews: true,

    // Marketing notifications
    marketingEmails: false,
    pushNotifications: true,
    promotionalAlerts: false,
  });

  const [notificationChannels, setNotificationChannels] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [chatSettings, setChatSettings] = useState({
    autoReply: true,
    showOnlineStatus: true,
    notifyWhenOffline: true,
    quickReplies: [
      "Thanks for your message!",
      "We'll get back to you soon.",
      "How can I help you today?",
    ],
  });

  const [newQuickReply, setNewQuickReply] = useState("");

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChannelChange = (key) => {
    setNotificationChannels((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChatSettingChange = (key) => {
    setChatSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addQuickReply = () => {
    if (!newQuickReply.trim()) return;

    setChatSettings((prev) => ({
      ...prev,
      quickReplies: [...prev.quickReplies, newQuickReply.trim()],
    }));
    setNewQuickReply("");
  };

  const removeQuickReply = (index) => {
    setChatSettings((prev) => ({
      ...prev,
      quickReplies: prev.quickReplies.filter((_, i) => i !== index),
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

  // Helper for notification toggle items
  const NotificationToggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-gray-800 dark:text-gray-200">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Notification Settings
        </h2>
        <SaveButton onClick={handleSave} loading={loading} />
      </div>

      {/* Notification Channels */}
      <SettingsSection title="Notification Channels" icon={Bell}>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Choose how you'd like to receive your notifications
        </p>
        <div className="space-y-2">
          <NotificationToggle
            label="Email Notifications"
            value={notificationChannels.email}
            onChange={() => handleChannelChange("email")}
          />
          <NotificationToggle
            label="Push Notifications"
            value={notificationChannels.push}
            onChange={() => handleChannelChange("push")}
          />
          <NotificationToggle
            label="SMS Notifications"
            description="Standard message rates may apply"
            value={notificationChannels.sms}
            onChange={() => handleChannelChange("sms")}
          />
        </div>
      </SettingsSection>

      {/* Order Notifications */}
      <SettingsSection title="Order Notifications" icon={ShoppingBag}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <NotificationToggle
            label="New Orders"
            description="Receive notifications when you get new orders"
            value={notifications.newOrder}
            onChange={() => handleNotificationChange("newOrder")}
          />
          <NotificationToggle
            label="Order Updates"
            description="Get notified about status changes to existing orders"
            value={notifications.orderUpdates}
            onChange={() => handleNotificationChange("orderUpdates")}
          />
          <NotificationToggle
            label="Order Cancellations"
            description="Alerts about cancelled orders"
            value={notifications.orderCancellations}
            onChange={() => handleNotificationChange("orderCancellations")}
          />
        </div>
      </SettingsSection>

      {/* Ad Performance Alerts */}
      <SettingsSection title="Ad Performance Alerts" icon={TrendingUp}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <NotificationToggle
            label="Low Engagement Alerts"
            description="Get notified when your ads have below-average engagement"
            value={notifications.lowEngagement}
            onChange={() => handleNotificationChange("lowEngagement")}
          />
          <NotificationToggle
            label="Budget Alerts"
            description="Notifications when your ad budget is 80% spent"
            value={notifications.budgetAlerts}
            onChange={() => handleNotificationChange("budgetAlerts")}
          />
          <NotificationToggle
            label="Campaign Ending"
            description="Get reminded when ad campaigns are about to end"
            value={notifications.campaignEnding}
            onChange={() => handleNotificationChange("campaignEnding")}
          />
        </div>
      </SettingsSection>

      {/* Customer Messages */}
      <SettingsSection title="Customer Messages" icon={MessageCircle}>
        <div className="space-y-4">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <NotificationToggle
              label="Customer Chat Notifications"
              description="Get notified about new customer messages"
              value={notifications.customerChat}
              onChange={() => handleNotificationChange("customerChat")}
            />
            <NotificationToggle
              label="Customer Reviews"
              description="Be alerted when customers leave reviews"
              value={notifications.customerReviews}
              onChange={() => handleNotificationChange("customerReviews")}
            />
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              Chat Settings
            </h3>
            <div className="space-y-3 pl-2">
              <NotificationToggle
                label="Auto-reply when away"
                value={chatSettings.autoReply}
                onChange={() => handleChatSettingChange("autoReply")}
              />
              <NotificationToggle
                label="Show online status"
                value={chatSettings.showOnlineStatus}
                onChange={() => handleChatSettingChange("showOnlineStatus")}
              />
              <NotificationToggle
                label="Get notified while offline"
                value={chatSettings.notifyWhenOffline}
                onChange={() => handleChatSettingChange("notifyWhenOffline")}
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Replies
              </h4>
              <div className="space-y-2">
                {chatSettings.quickReplies.map((reply, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {reply}
                    </span>
                    <button
                      onClick={() => removeQuickReply(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newQuickReply}
                    onChange={(e) => setNewQuickReply(e.target.value)}
                    placeholder="Add a quick reply message"
                    className="flex-1 px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addQuickReply}
                    className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-r-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Marketing Notifications */}
      <SettingsSection title="Marketing Communications" icon={Mail}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <NotificationToggle
            label="Marketing Emails"
            description="Receive emails about marketing tips and promotions"
            value={notifications.marketingEmails}
            onChange={() => handleNotificationChange("marketingEmails")}
          />
          <NotificationToggle
            label="Push Notifications"
            description="Get marketing alerts on your devices"
            value={notifications.pushNotifications}
            onChange={() => handleNotificationChange("pushNotifications")}
          />
          <NotificationToggle
            label="Promotional Alerts"
            description="Information about sales and special offers"
            value={notifications.promotionalAlerts}
            onChange={() => handleNotificationChange("promotionalAlerts")}
          />
        </div>
      </SettingsSection>
    </div>
  );
};

export default NotificationSettings;
