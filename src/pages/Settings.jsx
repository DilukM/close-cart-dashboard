import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsLayout from "./Settings/SettingsLayout";
import ProfileSettings from "./Settings/ProfileSettings";
import SecuritySettings from "./Settings/SecuritySettings";
import NotificationSettings from "./Settings/NotificationSettings";
import HelpAndSupportSettings from "./Settings/PreferenceSettings";
import OfferPreferences from "./Settings/OfferPreferences";

const Settings = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="offers" element={<OfferPreferences />} />
        <Route path="preferences" element={<HelpAndSupportSettings />} />
      </Route>
    </Routes>
  );
};

export default Settings;
