import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaLock,
  FaVenusMars
} from "react-icons/fa";

export const AddTeacher = () => {
  const navigate = useNavigate();
  const {schoolCode} = useParams()

  const [formData,setFormData] = useState({
    fullName: "",
    email: "",
    assignedClass: "",
    assignedSection: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: ""
  })
  const [message,setMessage] = useState("")
  const [loading,setLoading] = useState(false)

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

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

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/add-teacher`,
        formData
      );

      setMessage({ type: "success", text: "Principal added successfully!" });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        schoolId: "",
        password: "",
        confirmPassword: "",
        assignedClass: "",
        assignedSection: ""
      });

      navigate("/school");
    } catch (err) {
      console.log(err)
      const message = err.response?.data?.message || "Something went wrong.";
      // if (message === "This class has already been assigned a teacher") {
      //   Swal.fire({
      //     title: "School already has a principal",
      //     text: "Do you want to assign a new principal to this school now?",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonText: "Yes",
      //     cancelButtonText: "No",
      //     confirmButtonColor: "#4F46E5",
      //     cancelButtonColor: "#6B7280",
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       navigate(`/super-admin/school/${schoolCode}/re-assign-principal`);
      //     }
      //   });
      // }
      setMessage({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Add New Teacher
      </h2>

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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

        {/* FULL NAME */}
        <div>
          <label className="font-medium">Full Name</label>
          <div className="flex items-center border rounded-lg p-2 mt-1">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="fullName"
              className="flex-1 outline-none"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="font-medium">Email</label>
          <div className="flex items-center border rounded-lg p-2 mt-1">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              className="flex-1 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Class + Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="font-medium">Class</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
              <FaSchool className="text-gray-500 mr-2" />
              <select
                name="assignedClass"
                className="flex-1 outline-none"
                value={formData.assignedClass}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium">Section</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
              <FaSchool className="text-gray-500 mr-2" />
              <select
                name="assignedSection"
                className="flex-1 outline-none"
                value={formData.assignedSection}
                onChange={handleChange}
                required
              >
                <option value="">Select Section</option>
                {
                  sections.map((sec)=>(
                    <option key={sec} value={sec}>{sec}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* PHONE + GENDER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="font-medium">Phone</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
              <FaPhone className="text-gray-500 mr-2" />
              <input
                type="text"
                name="phone"
                className="flex-1 outline-none"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-medium">Gender</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
              <FaVenusMars className="text-gray-500 mr-2" />
              <select
                name="gender"
                className="flex-1 outline-none"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>

        {/* PASSWORD + CONFIRM PASSWORD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="font-medium">Password</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                className="flex-1 outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-medium">Confirm Password</label>
            <div className="flex items-center border rounded-lg p-2 mt-1">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                className="flex-1 outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          {loading ? "Adding..." : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};
