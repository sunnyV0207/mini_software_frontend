import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Edit, Mail, Phone } from "lucide-react";

const EditPrincipal = () => {
const { schoolCode } = useParams();
const navigate = useNavigate();
const [principal, setPrincipal] = useState({
name: "",
email: "",
phone: "",
});
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

// Fetch school to get principal details
useEffect(() => {
const fetchPrincipal = async () => {
try {
const res = await axios.get(
`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
);
setPrincipal(res.data.data.school.principal || { name: "", email: "", phone: "" });
setLoading(false);
} catch (err) {
console.error("Error fetching principal data:", err);
setLoading(false);
}
};
fetchPrincipal();
}, [schoolCode]);

const handleChange = (e) => {
const { name, value } = e.target;
setPrincipal((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
e.preventDefault();
setSaving(true);
try {
await axios.put(
`${import.meta.env.VITE_BACKEND_URL}/api/principal/${schoolCode}/edit`,
principal
);
setSaving(false);
navigate(`/super-admin/school/${schoolCode}`);
} catch (err) {
console.error("Error updating principal:", err);
setSaving(false);
}
};

if (loading)
return <div className="text-center py-10 text-gray-600">Loading principal details...</div>;

return ( <div className="p-6 animate-fadeIn"> <div className="max-w-3xl mx-auto">
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <User size={20} className="text-indigo-600" /> Edit Principal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Principal Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={principal.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Principal Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={principal.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Principal Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={principal.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition-all"
          >
            <Edit size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>

  </div>
</div>
);
};

export { EditPrincipal };
