import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = ({ children, toggleTheme, isDarkMode }) => {
  // State to track whether sidebar should be shown
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  // Listen for window resize to auto-hide/show sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar with sidebar toggle function */}
      <Navbar
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        className="fixed top-0 left-0 right-0 z-50"
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Conditionally render sidebar based on state */}
        {showSidebar && (
          <Sidebar className="fixed top-16 bottom-0 left-0 w-64 z-50" />
        )}

        {/* Content Pages */}
        <main
          className={`flex-1 p-4 overflow-y-auto bg-gray-300 dark:bg-gray-800 transition-all duration-300
            ${showSidebar ? "md:ml-64" : ""}`}
        >
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
