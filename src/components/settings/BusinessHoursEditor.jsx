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
    <div className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
      {daysOfWeek.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
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
                <div className="relative w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300">
                  {businessHours[key].isOpen ? "Open" : "Closed"}
                </span>
              </label>
            </div>
          </div>

          {businessHours[key].isOpen && (
            <div className="flex flex-col sm:flex-row sm:items-center w-full space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Clock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Hours:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:ml-2">
                <input
                  type="time"
                  value={businessHours[key].open}
                  onChange={(e) =>
                    handleHoursChange(key, "open", e.target.value)
                  }
                  className="px-2 py-1 sm:px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-[120px]"
                />
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  to
                </span>
                <input
                  type="time"
                  value={businessHours[key].close}
                  onChange={(e) =>
                    handleHoursChange(key, "close", e.target.value)
                  }
                  className="px-2 py-1 sm:px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-[120px]"
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
