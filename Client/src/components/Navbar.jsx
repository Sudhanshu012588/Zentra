import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
} from "lucide-react";
import { useStore } from "../../store/Store";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.User);
  const setUser = useStore((state) => state.setUser);

  const handleLogout = () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    setUser({
      id: null,
      name: null,
      email: null,
      isLoggedIn: false,
      profilePhoto: null,
      coverImage: null,
    });
    navigate("/");
  };

  const loggedInNavItems = [
    { label: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
    { label: "All Nudge", icon: <MessagesSquare />, path: "/allnudge" },
    { label: "Logout", icon: <LogOut />, action: handleLogout },
  ];

  const loggedOutNavItems = [
    { label: "Login", icon: <LogIn />, path: "/login" },
    { label: "Signup", icon: <UserPlus />, path: "/signup" },
  ];

  const commonNavItems = [
    { label: "Home", icon: <Home />, path: "/" },
  ];

  const currentNavItems = user.isLoggedIn ? loggedInNavItems : loggedOutNavItems;

  return (
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
          {[...commonNavItems, ...currentNavItems].map((item) => (
            <button
              key={item.label}
              onClick={item.action ? item.action : () => navigate(item.path)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                item.path && location.pathname === item.path
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
          {[...commonNavItems, ...currentNavItems].map((item) => (
            <button
              key={item.label}
              onClick={item.action ? item.action : () => navigate(item.path)}
              className={`flex flex-col items-center text-xs font-medium ${
                item.path && location.pathname === item.path
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
