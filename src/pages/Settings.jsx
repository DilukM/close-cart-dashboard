import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsLayout from "./Settings/SettingsLayout";
import ProfileSettings from "./Settings/ProfileSettings";
import SecuritySettings from "./Settings/SecuritySettings";
import NotificationSettings from "./Settings/NotificationSettings";
import PreferenceSettings from "./Settings/PreferenceSettings";

const Settings = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="preferences" element={<PreferenceSettings />} />
      </Route>
    </Routes>
  );
};

export default Settings;
