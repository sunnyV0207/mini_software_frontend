// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { User, Edit, Mail, Phone } from "lucide-react";

// const EditPrincipal = () => {
// const { schoolCode } = useParams();
// const navigate = useNavigate();
// const [principal, setPrincipal] = useState({
// name: "",
// email: "",
// phone: "",
// });
// const [loading, setLoading] = useState(true);
// const [saving, setSaving] = useState(false);

// // Fetch school to get principal details
// useEffect(() => {
// const fetchPrincipal = async () => {
// try {
// const res = await axios.get(
// `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
// );
// setPrincipal(res.data.data.school.principal || { name: "", email: "", phone: "" });
// setLoading(false);
// } catch (err) {
// console.error("Error fetching principal data:", err);
// setLoading(false);
// }
// };
// fetchPrincipal();
// }, [schoolCode]);

// const handleChange = (e) => {
// const { name, value } = e.target;
// setPrincipal((prev) => ({ ...prev, [name]: value }));
// };

// const handleSubmit = async (e) => {
// e.preventDefault();
// setSaving(true);
// try {
// await axios.put(
// `${import.meta.env.VITE_BACKEND_URL}/api/principal/${schoolCode}/edit`,
// principal
// );
// setSaving(false);
// navigate(`/super-admin/school/${schoolCode}`);
// } catch (err) {
// console.error("Error updating principal:", err);
// setSaving(false);
// }
// };

// if (loading)
// return <div className="text-center py-10 text-gray-600">Loading principal details...</div>;

// return ( <div className="p-6 animate-fadeIn"> <div className="max-w-3xl mx-auto">
//     <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
//         <User size={20} className="text-indigo-600" /> Edit Principal
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* Principal Name */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={principal.name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         {/* Principal Email */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={principal.email}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         {/* Principal Phone */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={principal.phone}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end mt-4">
//           <button
//             type="submit"
//             disabled={saving}
//             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition-all"
//           >
//             <Edit size={18} /> {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>

//       </form>
//     </div>

//   </div>
// </div>
// );
// };

// export { EditPrincipal };


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ArrowLeft, User, Mail, Phone, School } from "lucide-react";

const EditPrincipal = () => {
  const { principalId } = useParams();
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [principal, setPrincipal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  // Fetch existing principal data
  const fetchPrincipal = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/principal/${principalId}`
      );

      const data = res.data.data.principal;

      setPrincipal(data);

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        schoolCode: data.school?.schoolCode || "",
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching principal:", err);
      setLoading(false);
    }
  };

  // Fetch school list
  const fetchSchools = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEDN_URL}/api/auth/get-schools`
      );

      const arr = Array.isArray(res.data.data.schools)
        ? res.data.data.schools
        : [];

      setSchools(arr);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchPrincipal();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Updated Principal
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/principal/update-principal/${principalId}`,
        formData
      );

      Swal.fire({
        title: "Principal Updated!",
        text: "The principal info was updated successfully.",
        icon: "success",
      });

      navigate("/super-admin/manage-principals");
    } catch (error) {
      console.error("Error updating principal:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating.",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <p className="p-10 text-gray-600">Loading principal details...</p>;
  }

  return (
    <div className="p-6 md:p-10">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/super-admin/manage-principals")}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-6"
      >
        <ArrowLeft size={20} />
        Back to Principals
      </button>

      {/* FORM CONTAINER */}
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-200">

        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Edit Principal
        </h1>
        <p className="text-gray-500 mb-8">
          Update the details below to modify principal information.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* NAME + EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50">
                <User size={20} className="text-indigo-600" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none"
                  placeholder="Principal Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50">
                <Mail size={20} className="text-indigo-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none"
                  placeholder="Email address"
                />
              </div>
            </div>

          </div>

          {/* PHONE + GENDER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50">
                <Phone size={20} className="text-indigo-600" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3 bg-gray-50 outline-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg shadow-md hover:bg-indigo-700 transition"
          >
            Update Principal
          </button>

        </form>
      </div>
    </div>
  );
};

export {EditPrincipal};
