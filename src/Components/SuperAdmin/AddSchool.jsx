import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { School, MapPin, Phone, User } from "lucide-react";
import Swal from "sweetalert2";

const AddSchool = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCode: "",
    address: "",
    principalName: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/add-school`,
        formData
      );

    //   setMessage({ type: "success", text: "School added successfully!" });

      setFormData({
        schoolName: "",
        schoolCode: "",
        address: "",
        principalName: "",
        contactNumber: "",
      });

      Swal.fire({
        title: "School Added Successfully!",
        text: "Do you want to assign a principal to this school now?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Yes, assign principal",
        cancelButtonText: "No, maybe later",
        confirmButtonColor: "#4F46E5",  // Indigo
        cancelButtonColor: "#6B7280"    // Gray
    }).then((result) => {
    if (result.isConfirmed) {
        // Redirect to add-principal page
        navigate('/super-admin/add-principal');
    }
    });

    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add school",
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-50 px-4">

      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-indigo-100">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-1">
          Add School
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Enter accurate details to register a new school.
        </p>

        {/* Alerts */}
        {message.text && (
          <div
            className={`p-3 mb-6 rounded-lg text-center text-white ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* School Name - full width */}
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
            School Name
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 bg-gray-50">
            <School size={20} className="text-indigo-600" />
            <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            required
            placeholder="e.g. Alpine International School"
            className="w-full bg-transparent outline-none"
            />
        </div>
        </div>

          {/* Address full width */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 bg-gray-50">
              <MapPin size={20} className="text-indigo-600" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Complete address of the school"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* GRID: School Code + Contact Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contact Number
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 bg-gray-50">
                <Phone size={20} className="text-indigo-600" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="School contact number"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            
            {/* School Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                School Code
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 bg-gray-50">
                <User size={20} className="text-indigo-600" />
                <input
                  type="text"
                  name="schoolCode"
                  value={formData.schoolCode}
                  onChange={handleChange}
                  required
                  placeholder="Unique school code"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>


          </div>


          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Adding..." : "Add School"}
          </button>
        </form>

      </div>
    </div>
  );
};

export {AddSchool};
