import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();
  const email = useLocation().state?.email;

  const handleReset = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // Backend reset password logic should be here

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111225] p-10 rounded-2xl shadow-xl border border-indigo-500/20"
      >
        <h1 className="text-3xl font-semibold text-center text-indigo-400 mb-6">
          Reset Password
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Reset password for  
          <span className="text-indigo-300"> {email}</span>
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleReset}>
          {/* New Password */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 
              text-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 
              text-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Re-enter password"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
            rounded-lg shadow-lg hover:shadow-indigo-500/40 transition"
          >
            Reset Password
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
