import React from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children, toggleTheme, isDarkMode }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        className="fixed top-0 left-0 right-0 z-50"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar className="fixed top-16 bottom-0 left-0 w-64 z-50" />

        {/* Content Pages */}
        <main className="flex-1 ml-64 p-4 overflow-y-auto bg-gray-300 dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
