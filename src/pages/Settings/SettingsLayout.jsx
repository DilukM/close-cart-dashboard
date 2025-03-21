import React from "react";
import { Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="w-full">
        {/* Settings Content Area */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
