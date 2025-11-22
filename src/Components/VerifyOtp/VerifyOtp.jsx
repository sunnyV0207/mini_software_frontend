import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Move to next input automatically
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");

    if (otp.length !== 6) {
      alert("Please enter all 6 digits!");
      return;
    }

    // If OTP correct → Redirect user to reset password page
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111225] p-10 rounded-2xl shadow-xl border border-indigo-500/20"
      >
        <h1 className="text-3xl font-semibold text-center text-indigo-400 mb-6">
          Verify OTP
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Enter the 6-digit OTP sent to 
          <span className="text-indigo-300"> {email} </span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP Inputs */}
          <div className="flex justify-between gap-3 mb-8">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold 
                text-indigo-300 bg-[#0f0f1f] border border-gray-700 rounded-lg 
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
            rounded-lg shadow-lg hover:shadow-indigo-500/40 transition"
          >
            Verify OTP
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
