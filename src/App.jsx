import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Offers from "./pages/OfferManagement";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Check authentication status on mount and token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
    // Listen for storage changes (useful for multiple tabs)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Load saved dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          <Routes>
            {/* Public Authentication Route */}
            <Route
              path="/auth"
              element={<AuthPage setIsAuthenticated={setIsAuthenticated} />}
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="offers" element={<Offers />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected Nested Routes */}
            <Route
              path="/offers"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <Offers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to dashboard if authenticated, otherwise to login */}
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkMode ? "dark" : "light"}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
