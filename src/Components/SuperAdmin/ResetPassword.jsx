import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { KeyRound, Edit } from "lucide-react";

const ResetPassword = () => {
const { schoolCode } = useParams();
const navigate = useNavigate();
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
setError("");

if (password !== confirmPassword) {
  setError("Passwords do not match");
  return;
}

setSaving(true);
try {
  await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/api/principal/${schoolCode}/reset-password`,
    { password }
  );
  setSaving(false);
  navigate(`/super-admin/school/${schoolCode}`);
} catch (err) {
  console.error("Error resetting password:", err);
  setError("Failed to reset password. Please try again.");
  setSaving(false);
}
};

return ( <div className="p-6 animate-fadeIn"> <div className="max-w-md mx-auto">
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <KeyRound size={20} className="text-indigo-600" /> Reset Password
      </h2>

      {error && (
        <div className="text-red-500 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* New Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition-all"
          >
            <Edit size={18} /> {saving ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>

  </div>
</div>
);
};

export { ResetPassword };
