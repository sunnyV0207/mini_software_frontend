import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111225] p-10 rounded-2xl shadow-2xl border border-indigo-500/20"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Login to EduNexus
        </h1>

        <form className="flex flex-col gap-6">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 text-gray-200
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 text-gray-200
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 cursor-pointer text-gray-400 hover:text-white text-lg"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
            rounded-lg shadow-lg hover:shadow-indigo-400/30 transition"
          >
            Login
          </motion.button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-indigo-400 mt-4 inline-block hover:underline transition"
          >
            Forgot Password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
