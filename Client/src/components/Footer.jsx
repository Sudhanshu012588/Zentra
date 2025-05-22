import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 fixed  dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Logo and tagline */}
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Zentra</h1>
          <p>Empowering conversations. Building connections. Welcome to the future of social media.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
            <li><Link to="/signup" className="hover:text-blue-600">Sign Up</Link></li>
          </ul>
        </div>

        {/* Contact / About */}
        <div>
          <h2 className="font-semibold mb-3">About</h2>
          <ul className="space-y-2">
            <li>Email: team@zentra.app</li>
            <li>Support: support@zentra.app</li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-gray-300 dark:border-gray-700 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Zentra. All rights reserved.
      </div>
    </footer>
  );
}
