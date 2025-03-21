import React from "react";

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

export default SettingsSection;
