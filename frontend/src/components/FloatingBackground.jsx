import React from "react";
import { motion } from "framer-motion";

/**
 * Shared floating background component for consistent styling across pages
 * Used in Dashboard1, Dashboard2, Login, and Signup pages
 */

// Generate floating particles
const generateFloatingElements = (count = 6) => {
  return Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  ));
};

// Full dashboard background with geometric shapes and gradient orbs
export function DashboardBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {generateFloatingElements(6)}
      
      {/* Geometric shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border border-gray-200/50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 border border-gray-300/50 rounded-lg"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
    </div>
  );
}

// Smaller version for auth pages (Login/Signup)
export function AuthPageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {generateFloatingElements(4)}
      
      {/* Geometric shapes */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 border border-gray-200 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-16 h-16 border border-gray-300 rounded-lg"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-indigo-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
    </div>
  );
}

export default DashboardBackground;
