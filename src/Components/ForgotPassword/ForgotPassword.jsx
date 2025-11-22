import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, { email },{withCredentials:true})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error sending the OTP!", error);
      });
    // After backend sends OTP successfully:
    navigate("/verify-otp", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111225] p-10 rounded-2xl shadow-2xl border border-indigo-500/20"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Forgot Password
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Enter your registered email.  
          A 6-digit OTP will be sent to reset your password.
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSendOtp}>
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 text-gray-200
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
            rounded-lg shadow-lg hover:shadow-indigo-400/30 transition"
          >
            Send OTP
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
