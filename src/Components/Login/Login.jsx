import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const LoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      const user = res.data.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      const role = user.role;
      if (role === "Super Admin") {
        navigate("/super-admin");
      } else if (role === "Principal") {
        navigate("/school");
      } else if (role === "Teacher") {
        navigate("/teacher");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

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

        {message && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg">
            {message}
          </p>
        )}

        <form className="flex flex-col gap-6" onSubmit={LoginSubmit}>
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 text-gray-200
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f1f] border border-gray-700 text-gray-200
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 cursor-pointer text-gray-400 hover:text-white text-lg select-none bg-transparent border-none outline-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={!loading ? { scale: 0.95 } : {}}
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg shadow-lg transition flex items-center justify-center gap-2 ${loading
                ? "bg-indigo-600/70 text-gray-200 cursor-not-allowed opacity-80"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-400/30"
              }`}
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
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
