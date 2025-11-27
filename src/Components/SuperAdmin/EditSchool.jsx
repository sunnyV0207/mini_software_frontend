import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { School as SchoolIcon, Edit, User, Mail, Phone } from "lucide-react";

const EditSchool = () => {
const { schoolCode } = useParams();
const navigate = useNavigate();
const [school, setSchool] = useState({
schoolName: "",
schoolCode: "",
contactNumber: "",
address: "",
principal: {
name: "",
email: "",
phone: "",
},
});
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

// Fetch school details
useEffect(() => {
const fetchSchool = async () => {
try {
const res = await axios.get(
`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
);
setSchool(res.data.data.school);
setLoading(false);
} catch (err) {
console.error("Error fetching school data:", err);
setLoading(false);
}
};
fetchSchool();
}, [schoolCode]);

const handleChange = (e) => {
const { name, value } = e.target;
if (name.startsWith("principal.")) {
const key = name.split(".")[1];
setSchool((prev) => ({
...prev,
principal: { ...prev.principal, [key]: value },
}));
} else {
setSchool((prev) => ({ ...prev, [name]: value }));
}
};

const handleSubmit = async (e) => {
e.preventDefault();
setSaving(true);
try {
await axios.put(
`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/edit`,
school
);
setSaving(false);
navigate(`/super-admin/school/${schoolCode}`);
} catch (err) {
console.error("Error updating school:", err);
setSaving(false);
}
};

if (loading)
return <div className="text-center py-10 text-gray-600">Loading school...</div>;

return ( <div className="p-6 animate-fadeIn"> <div className="max-w-3xl mx-auto space-y-8">
    {/* SCHOOL DETAILS FORM */}
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <SchoolIcon size={20} className="text-indigo-600" /> Edit School
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* School Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            School Name
          </label>
          <input
            type="text"
            name="schoolName"
            value={school.schoolName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* School Code */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            School Code
          </label>
          <input
            type="text"
            name="schoolCode"
            value={school.schoolCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            readOnly
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Contact Number
          </label>
          <input
            type="text"
            name="contactNumber"
            value={school.contactNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={school.address}
            onChange={handleChange}
            rows={3}
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

export { EditSchool };
