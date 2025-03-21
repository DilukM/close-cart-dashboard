import React, { useState } from "react";
import { Clock } from "lucide-react";

const BusinessHoursEditor = ({ businessHours, onChange }) => {
  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const handleDayToggle = (day) => {
    const updatedHours = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        isOpen: !businessHours[day].isOpen,
      },
    };
    onChange(updatedHours);
  };

  const handleHoursChange = (day, type, value) => {
    const updatedHours = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [type]: value,
      },
    };
    onChange(updatedHours);
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
        >
          <div className="flex items-center justify-between md:w-1/3 mb-3 md:mb-0">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={businessHours[key].isOpen}
                  onChange={() => handleDayToggle(key)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {businessHours[key].isOpen ? "Open" : "Closed"}
                </span>
              </label>
            </div>
          </div>

          {businessHours[key].isOpen && (
            <div className="flex items-center md:ml-4 space-x-2 w-full md:w-2/3">
              <Clock className="text-gray-400 w-5 h-5" />
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={businessHours[key].open}
                  onChange={(e) =>
                    handleHoursChange(key, "open", e.target.value)
                  }
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="time"
                  value={businessHours[key].close}
                  onChange={(e) =>
                    handleHoursChange(key, "close", e.target.value)
                  }
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BusinessHoursEditor;
