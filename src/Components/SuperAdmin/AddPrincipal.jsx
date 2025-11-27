import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AddPrincipalForm = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [schoolCode, setSchoolCode] = useState("");

  // Fetch all schools for dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/school/fetch-schools`
        );
        // console.log(res.data.data.schools);
        setSchools(res.data.data.schools);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load schools." });
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const selectedSchool = schools.find(school => school._id === formData.schoolId);
    if(selectedSchool){
      setSchoolCode(selectedSchool.schoolCode);
    }
  },[formData.schoolId]);

  // Change handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/principal/add-principal`,
        formData
      );
      // console.log(res.data);
      setMessage({ type: "success", text: "Principal added successfully!" });

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        schoolId: "",
        password: "",
      });
      navigate("/super-admin");
    } catch (err) {
      console.log(err)
      const message = err.response?.data?.message || "Something went wrong.";
      if(message == "School already has a principal"){
        Swal.fire({
                title: "School has already a principal",
                text: "Do you want to assign a new principal to this school now?",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                confirmButtonColor: "#4F46E5",  // Indigo
                cancelButtonColor: "#6B7280"    // Gray
            }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to add-principal page
                navigate(`/super-admin/school/${schoolCode}/re-assign-principal`);
            }
            });
      }
      setMessage({
        type: "error",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Add New Principal
      </h2>

      {/* Alert Messages */}
      {message.text && (
        <div
          className={`p-3 mb-5 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            className="border rounded-lg p-2 focus:ring focus:ring-indigo-300"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="border rounded-lg p-2 focus:ring focus:ring-indigo-300"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            className="border rounded-lg p-2 focus:ring focus:ring-indigo-300"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* School Select */}
        <div className="flex flex-col">
          <label className="font-medium">Select School</label>
          <select
            name="schoolId"
            className="border rounded-lg p-2 focus:ring focus:ring-indigo-300"
            value={formData.schoolId}
            onChange={handleChange}
            required
          >
            <option value="">Choose School</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.schoolName}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="border rounded-lg p-2 focus:ring focus:ring-indigo-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {loading ? "Adding..." : "Add Principal"}
          </button>
        </div>
      </form>
    </div>
  );
};

// export default AddPrincipal;
