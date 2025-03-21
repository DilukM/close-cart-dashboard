import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Gift,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
  Shield,
  Bell,
  Palette,
  LifeBuoy,
  Tag,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.includes("/settings")
  );

  const mainMenuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Offer Management", path: "/offers", icon: Gift },
  ];

  const settingsSubMenuItems = [
    { name: "Profile", path: "/settings/profile", icon: Store },
    { name: "Security", path: "/settings/security", icon: Shield },
    { name: "Notifications", path: "/settings/notifications", icon: Bell },
    { name: "Offer Preferences", path: "/settings/offers", icon: Tag },
    { name: "Help & Support", path: "/settings/preferences", icon: LifeBuoy },
  ];

  // Handle settings menu click
  const handleSettingsClick = () => {
    // If settings is not open, open it and navigate to the first tab
    if (!settingsOpen) {
      setSettingsOpen(true);
      // Only navigate if we're not already on a settings page
      if (!location.pathname.includes("/settings")) {
        navigate("/settings/profile");
      }
    }
    // If already open and we're on the main settings path, navigate to first tab
    else if (location.pathname === "/settings") {
      navigate("/settings/profile");
    }
    // Otherwise just toggle the dropdown
    else {
      setSettingsOpen(!settingsOpen);
    }
  };

  // Watch location changes to keep settings open when on settings pages
  useEffect(() => {
    if (location.pathname.includes("/settings") && !settingsOpen) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);

  const sidebarVariants = {
    hidden: { x: -250 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.aside
      initial="visible"
      animate="visible"
      variants={sidebarVariants}
      className="w-64 min-h-screen p-6 bg-gradient-to-b from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      <div className="flex items-center pb-10">
        <img src="/assets/logo.png" alt="Logo" className=" h-10 mr-2" />
      </div>
      <ul className="space-y-6">
        {mainMenuItems.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative
                ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20 text-yellow-700 dark:text-yellow-400 shadow-lg shadow-yellow-500/10 dark:shadow-yellow-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100/50 dark:hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 dark:bg-yellow-400 rounded-l-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <item.icon
                    className={`w-5 h-5 transition-all duration-300 
                    ${
                      isActive
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-400 dark:text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          </motion.li>
        ))}

        {/* Settings with dropdown */}
        <motion.li
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className="relative"
        >
          <div
            onClick={handleSettingsClick}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer relative
              ${
                location.pathname.includes("/settings")
                  ? "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20 text-yellow-700 dark:text-yellow-400 shadow-lg shadow-yellow-500/10 dark:shadow-yellow-500/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100/50 dark:hover:bg-white/5"
              }`}
          >
            {location.pathname.includes("/settings") && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 dark:bg-yellow-400 rounded-l-full"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <Settings
              className={`w-5 h-5 transition-all duration-300 
                ${
                  location.pathname.includes("/settings")
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-400 dark:text-gray-400"
                }`}
            />
            <span className="font-medium">Settings</span>
            <div className="ml-auto">
              {settingsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Settings submenu */}
          {settingsOpen && (
            <div className="mt-2 ml-5 space-y-1">
              {settingsSubMenuItems.map((subItem, idx) => (
                <NavLink
                  key={idx}
                  to={subItem.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 pl-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100/50 dark:hover:bg-white/5"
                    }`
                  }
                >
                  <subItem.icon className="w-4 h-4" />
                  <span className="text-sm">{subItem.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </motion.li>
      </ul>
    </motion.aside>
  );
};

export default Sidebar;
