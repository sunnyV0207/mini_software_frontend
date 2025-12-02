import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaDoorOpen, FaUsers, FaKey } from "react-icons/fa";

export const AddStudent = ()=> {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    classNumber: "",
    section: "",
    rollNumber: "",
    parentName: "",
    parentPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // dropdown values
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/add-student`,
        formData
      );

      setMessage({ type: "success", text: "Student added successfully!" });

      // clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        classNumber: "",
        section: "",
        rollNumber: "",
        parentName: "",
        parentPhone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      setMessage({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">

      {/* Heading */}
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Add New Student</h2>

      {/* TOP MESSAGE */}
      {message.text && (
        <div
          className={`p-3 mb-5 rounded-md text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="font-medium">Full Name</label>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Student Name"
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="font-medium">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="font-medium">Phone</label>
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="font-medium">Gender</label>
          <div className="relative">
            <FaVenusMars className="absolute top-3 left-3 text-gray-500" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </div>
        </div>

        {/* Class Number */}
        <div>
          <label className="font-medium">Class</label>
          <div className="relative">
            <FaDoorOpen className="absolute top-3 left-3 text-gray-500" />
            <select
              name="classNumber"
              value={formData.classNumber}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section */}
        <div>
          <label className="font-medium">Section</label>
          <div className="relative">
            <FaUsers className="absolute top-3 left-3 text-gray-500" />
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Roll Number */}
        <div className="md:col-span-2">
          <label className="font-medium">Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Enter Roll Number"
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
          />
        </div>

        {/* Parent Name */}
        <div>
          <label className="font-medium">Parent Name</label>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Parent's Name"
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Parent Phone */}
        <div>
          <label className="font-medium">Parent Phone</label>
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              placeholder="Parent's Phone"
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="font-medium">Password</label>
          <div className="relative">
            <FaKey className="absolute top-3 left-3 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="font-medium">Confirm Password</label>
          <div className="relative">
            <FaKey className="absolute top-3 left-3 text-gray-500" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="md:col-span-2">
          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
            type="submit"
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
