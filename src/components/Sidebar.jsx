import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Gift, Settings } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Offer Management", path: "/offers", icon: Gift },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

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
        {menuItems.map((item, index) => (
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
                `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 
                ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20 text-yellow-700 dark:text-yellow-400 shadow-lg shadow-yellow-500/10 dark:shadow-yellow-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100/50 dark:hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 transition-all duration-300 
                    ${
                      isActive
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-400 dark:text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-full bg-yellow-500 dark:bg-yellow-400 rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default Sidebar;
