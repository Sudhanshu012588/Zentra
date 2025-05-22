import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, MessageCircle, Heart, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const features = [
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Connect with Everyone",
    description: "Follow people, gain followers, and stay in touch with your campus or the world.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
    title: "Real-Time Conversations",
    description: "Chat and reply instantly. Every post and message updates in real-time.",
  },
  {
    icon: <Heart className="h-8 w-8 text-blue-600" />,
    title: "Engage with Posts",
    description: "Like, comment, and repost content to keep the conversation going.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
    title: "Secure & Private",
    description: "Your data stays yours. Built with modern auth and token protection.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-white text-gray-800  dark:bg-gray-950 dark:text-white h-50">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center min-h-screen flex flex-col justify-center">
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-6xl font-extrabold mb-6"
  >
    Welcome to ZENTRA
  </motion.h1>
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
  >
    The social platform to connect, share, and engage with your peers. Join the conversation and be part of your campus buzz.
  </motion.p>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="mt-10 flex justify-center gap-6 flex-wrap"
  >
    <button
      onClick={() => navigate("/signup")}
      className="px-8 py-4 bg-blue-600 text-white rounded-full text-xl font-semibold hover:bg-blue-700 transition"
    >
      Get Started
    </button>
    <button
      onClick={() => navigate("/login")}
      className="px-8 py-4 border border-blue-600 text-blue-600 rounded-full text-xl font-semibold hover:bg-blue-50 transition dark:hover:bg-gray-800"
    >
      Already have an account?
    </button>
  </motion.div>
</section>


      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-3xl font-semibold text-center mb-12">Why ZENTRA?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
              <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
              >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>

          </>
  );
}
