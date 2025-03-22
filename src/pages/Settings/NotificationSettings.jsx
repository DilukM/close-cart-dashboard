import React, { useState, useEffect } from "react";
import {
  Bell,
  ShoppingBag,
  TrendingUp,
  MessageCircle,
  Mail,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";

const NotificationSettings = () => {
  // Initial state that will be fetched from server
  const [initialState, setInitialState] = useState({
    notifications: {
      newOrder: true,
      orderUpdates: true,
      orderCancellations: true,
      lowEngagement: true,
      budgetAlerts: true,
      campaignEnding: false,
      customerChat: true,
      customerReviews: true,
      marketingEmails: false,
      pushNotifications: true,
      promotionalAlerts: false,
    },
    notificationChannels: {
      email: true,
      push: true,
      sms: false,
    },
    chatSettings: {
      autoReply: true,
      showOnlineStatus: true,
      notifyWhenOffline: true,
      quickReplies: [
        "Thanks for your message!",
        "We'll get back to you soon.",
        "How can I help you today?",
      ],
    },
  });

  // Current state that user can modify
  const [notifications, setNotifications] = useState({
    ...initialState.notifications,
  });
  const [notificationChannels, setNotificationChannels] = useState({
    ...initialState.notificationChannels,
  });
  const [chatSettings, setChatSettings] = useState({
    ...initialState.chatSettings,
  });

  // Track changes for sections
  const [hasChanges, setHasChanges] = useState({
    channels: false,
    orders: false,
    adPerformance: false,
    customerMessages: false,
    marketing: false,
  });

  const [loadingState, setLoadingState] = useState({
    channels: false,
    orders: false,
    adPerformance: false,
    customerMessages: false,
    marketing: false,
  });

  const [newQuickReply, setNewQuickReply] = useState("");

  // Simulated fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, fetch from API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Using default values for demo
    };

    fetchData();
  }, []);

  // Check for changes when state changes
  useEffect(() => {
    // Check channels
    const channelsChanged =
      JSON.stringify(initialState.notificationChannels) !==
      JSON.stringify(notificationChannels);

    // Check order notifications
    const orderNotificationsChanged =
      initialState.notifications.newOrder !== notifications.newOrder ||
      initialState.notifications.orderUpdates !== notifications.orderUpdates ||
      initialState.notifications.orderCancellations !==
        notifications.orderCancellations;

    // Check ad performance
    const adPerformanceChanged =
      initialState.notifications.lowEngagement !==
        notifications.lowEngagement ||
      initialState.notifications.budgetAlerts !== notifications.budgetAlerts ||
      initialState.notifications.campaignEnding !==
        notifications.campaignEnding;

    // Check customer messages
    const customerMessagesChanged =
      initialState.notifications.customerChat !== notifications.customerChat ||
      initialState.notifications.customerReviews !==
        notifications.customerReviews ||
      JSON.stringify(initialState.chatSettings) !==
        JSON.stringify(chatSettings);

    // Check marketing
    const marketingChanged =
      initialState.notifications.marketingEmails !==
        notifications.marketingEmails ||
      initialState.notifications.pushNotifications !==
        notifications.pushNotifications ||
      initialState.notifications.promotionalAlerts !==
        notifications.promotionalAlerts;

    setHasChanges({
      channels: channelsChanged,
      orders: orderNotificationsChanged,
      adPerformance: adPerformanceChanged,
      customerMessages: customerMessagesChanged,
      marketing: marketingChanged,
    });
  }, [notifications, notificationChannels, chatSettings, initialState]);

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

  const setLoading = (section, isLoading) => {
    setLoadingState((prev) => ({
      ...prev,
      [section]: isLoading,
    }));
  };

  const handleSaveChannels = async () => {
    setLoading("channels", true);
    try {
      // In a real app, save to backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state on successful save
      setInitialState((prev) => ({
        ...prev,
        notificationChannels: { ...notificationChannels },
      }));

      toast.success("Notification channels saved successfully!");
    } catch (error) {
      toast.error("Failed to save notification channels");
    } finally {
      setLoading("channels", false);
    }
  };

  const handleSaveOrderNotifications = async () => {
    setLoading("orders", true);
    try {
      // In a real app, save to backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state on successful save
      setInitialState((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          newOrder: notifications.newOrder,
          orderUpdates: notifications.orderUpdates,
          orderCancellations: notifications.orderCancellations,
        },
      }));

      toast.success("Order notifications saved successfully!");
    } catch (error) {
      toast.error("Failed to save order notifications");
    } finally {
      setLoading("orders", false);
    }
  };

  const handleSaveAdPerformance = async () => {
    setLoading("adPerformance", true);
    try {
      // In a real app, save to backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state on successful save
      setInitialState((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          lowEngagement: notifications.lowEngagement,
          budgetAlerts: notifications.budgetAlerts,
          campaignEnding: notifications.campaignEnding,
        },
      }));

      toast.success("Ad performance alerts saved successfully!");
    } catch (error) {
      toast.error("Failed to save ad performance alerts");
    } finally {
      setLoading("adPerformance", false);
    }
  };

  const handleSaveCustomerMessages = async () => {
    setLoading("customerMessages", true);
    try {
      // In a real app, save to backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state on successful save
      setInitialState((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          customerChat: notifications.customerChat,
          customerReviews: notifications.customerReviews,
        },
        chatSettings: { ...chatSettings },
      }));

      toast.success("Customer message settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save customer message settings");
    } finally {
      setLoading("customerMessages", false);
    }
  };

  const handleSaveMarketing = async () => {
    setLoading("marketing", true);
    try {
      // In a real app, save to backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update initial state on successful save
      setInitialState((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          marketingEmails: notifications.marketingEmails,
          pushNotifications: notifications.pushNotifications,
          promotionalAlerts: notifications.promotionalAlerts,
        },
      }));

      toast.success("Marketing communication preferences saved successfully!");
    } catch (error) {
      toast.error("Failed to save marketing preferences");
    } finally {
      setLoading("marketing", false);
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
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Notification Settings
      </h2>

      {/* Notification Channels */}
      <SettingsSection
        title="Notification Channels"
        icon={Bell}
        onSave={handleSaveChannels}
        loading={loadingState.channels}
        disabled={!hasChanges.channels}
      >
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
      <SettingsSection
        title="Order Notifications"
        icon={ShoppingBag}
        onSave={handleSaveOrderNotifications}
        loading={loadingState.orders}
        disabled={!hasChanges.orders}
      >
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
      <SettingsSection
        title="Ad Performance Alerts"
        icon={TrendingUp}
        onSave={handleSaveAdPerformance}
        loading={loadingState.adPerformance}
        disabled={!hasChanges.adPerformance}
      >
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
      <SettingsSection
        title="Customer Messages"
        icon={MessageCircle}
        onSave={handleSaveCustomerMessages}
        loading={loadingState.customerMessages}
        disabled={!hasChanges.customerMessages}
      >
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
      <SettingsSection
        title="Marketing Communications"
        icon={Mail}
        onSave={handleSaveMarketing}
        loading={loadingState.marketing}
        disabled={!hasChanges.marketing}
      >
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
