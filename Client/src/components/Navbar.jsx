import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogIn, UserPlus, LayoutDashboard, LogOut } from "lucide-react";
import { useStore } from "../../store/Store"; // Import useStore

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.User); // Get user state from store
  const setUser = useStore((state) => state.setUser); // Get setUser action from store

  const handleLogout = () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken"); // Assuming RefreshToken also exists
    setUser({
      id: null,
      name: null,
      email: null,
      isLoggedIn: false,
      profilePhoto: null,
      coverImage: null,
    }); // Reset user state
    navigate("/"); // Navigate to homepage after logout
  };

  // Define navigation items based on login status
  const loggedInNavItems = [
    { label: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
    { label: "Logout", icon: <LogOut />, action: handleLogout }, // Logout has an action, not a path
  ];

  const loggedOutNavItems = [
    { label: "Login", icon: <LogIn />, path: "/login" },
    { label: "Signup", icon: <UserPlus />, path: "/signup" },
  ];

  const commonNavItems = [
    { label: "Home", icon: <Home />, path: "/" }, // Always show Home
  ];

  const currentNavItems = user.isLoggedIn ? loggedInNavItems : loggedOutNavItems;

  return (
    // Added h-16 to give the navbar a fixed height and prevent overlap
    <nav className="w-full fixed bottom-0 md:top-0 md:bottom-auto bg-white dark:bg-gray-900 shadow-md z-50 h-16">
      <div className="max-w-6xl mx-auto flex items-center justify-between md:justify-start gap-6 p-4 md:px-8 h-full">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-tight md:mr-12"
          style={{ fontFamily: "Segoe UI", letterSpacing: "-0.03em" }}
        >
          Zentra
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 ml-auto h-full">
          {commonNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
          {currentNavItems.map((item) => (
            <button
              key={item.label} // Use label as key since path might not exist for logout
              onClick={item.action ? item.action : () => navigate(item.path)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                location.pathname === item.path && item.path // Only highlight if it's a path and matches
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden flex justify-around bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-2">
          {commonNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center text-xs font-medium ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          {currentNavItems.map((item) => (
            <button
              key={item.label} // Use label as key
              onClick={item.action ? item.action : () => navigate(item.path)}
              className={`flex flex-col items-center text-xs font-medium ${
                location.pathname === item.path && item.path
                  ? "text-blue-600"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
