import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Globe,
  LogOut,
  MessagesSquare,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "../../store/Store";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.User);
  const setUser = useStore((state) => state.setUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false);
  };

  const loggedInNavItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { label: "All Nudge", icon: <MessagesSquare size={18} />, path: "/allnudge" },
    { label: "Logout", icon: <LogOut size={18} />, action: handleLogout },
  ];

  const loggedOutNavItems = [
    { label: "Login", icon: <LogIn size={18} />, path: "/login" },
    { label: "Signup", icon: <UserPlus size={18} />, path: "/signup" },
  ];

  const commonNavItems = [
    { label: "Home", icon: <Home size={18} />, path: "/" },
    { label: "Community", icon: <Globe size={18} />, path: "/Community" },
  ];

  const currentNavItems = localStorage.getItem("AccessToken")
    ? loggedInNavItems
    : loggedOutNavItems;

  const allNavItems = [...commonNavItems, ...currentNavItems];

  return (
    <>
      <nav className="w-full fixed top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4 md:px-8">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-tight"
            style={{ fontFamily: "Segoe UI", letterSpacing: "-0.03em" }}
          >
            Zentra
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 ml-auto">
            {allNavItems.map((item) => (
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-800 dark:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Sidebar Drawer for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-blue-600">Zentra Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {allNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.action) item.action();
                else {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                item.path && location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
