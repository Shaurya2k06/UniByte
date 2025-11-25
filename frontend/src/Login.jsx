import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Lock, ArrowRight, Chrome, AlertCircle, Sparkles } from "lucide-react";
import axios from "axios";
import { containerVariants, itemVariants } from "./lib/animationVariants";
import { AuthPageBackground } from "./components/FloatingBackground";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://byteme-ue8b.onrender.com/public/login",
        { userName, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { token, role } = response.data;
      const isAuthenticated = !!token;
      localStorage.setItem("jwt", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", role);
      localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
      console.log("Login successful:", response.data);

      if(role === "dev" || role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/studentDashboard")
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);


  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex">
      {/* Floating Background Elements */}
      <AuthPageBackground />

      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <motion.img
            src="/loginImage.svg"
            alt="Login"
            className="w-full max-w-lg mx-auto mb-6 drop-shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Welcome Back!
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Continue your digital campus journey
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-6"
          >
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg mb-4 relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-6 h-6 text-gray-700" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Sign In
            </motion.h1>
            
            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Welcome back! Please enter your details
            </motion.p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
                    animate={{ 
                      scale: focusedField === "username" ? 1.1 : 1,
                      color: focusedField === "username" ? "#6366f1" : "#9ca3af"
                    }}
                  >
                    <User className="h-4 w-4" />
                  </motion.div>
                  
                  <motion.input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 text-sm"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                    whileFocus={{ scale: 1.01 }}
                    required
                  />
                  
                  {focusedField === "username" && (
                    <motion.div
                      className="absolute inset-0 border-2 border-gray-400 rounded-xl pointer-events-none"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
                    animate={{ 
                      scale: focusedField === "password" ? 1.1 : 1,
                      color: focusedField === "password" ? "#6366f1" : "#9ca3af"
                    }}
                  >
                    <Lock className="h-4 w-4" />
                  </motion.div>
                  
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    whileFocus={{ scale: 1.01 }}
                    required
                  />
                  
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {showPassword ? (
                        <motion.div
                          key="eye-off"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  {focusedField === "password" && (
                    <motion.div
                      className="absolute inset-0 border-2 border-gray-400 rounded-xl pointer-events-none"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="flex items-center space-x-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl"
                  >
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700 text-xs">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group relative overflow-hidden text-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"
                  animate={{ x: isLoading ? [0, 100, 0] : 0 }}
                  transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0 }}
                />
                
                <div className="relative z-10 flex items-center space-x-2">
                  {isLoading ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.button>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 font-medium">or continue with</span>
                </div>
              </motion.div>

              {/* Google Sign In */}
              <motion.button
                type="button"
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-gray-50 group shadow-sm hover:shadow-md text-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Chrome className="w-4 h-4 text-gray-600" />
                </motion.div>
                <span>Continue with Google</span>
              </motion.button>

              {/* Sign Up Link */}
              <motion.div variants={itemVariants} className="text-center pt-3">
                <p className="text-gray-600 text-xs">
                  Don't have an account?{" "}
                  <Link 
                    to="/register" 
                    className="text-gray-900 hover:text-gray-700 font-semibold hover:underline transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Sign Up</span>
                    <motion.div
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-2 h-2" />
                    </motion.div>
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;