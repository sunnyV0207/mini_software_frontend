import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaDoorOpen,
  FaUsers,
  FaIdBadge,
  FaUserFriends,
} from "react-icons/fa";

export const EditStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
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
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

  const fetchStudent = async (id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/${id}/get-student`
      );
      const studentData = res.data?.data;
      setStudent(studentData);
      setFormData({
        name: studentData.name || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        gender: studentData.gender || "",
        classNumber: studentData.class?.classNumber || "",
        section: studentData.class?.section || "",
        rollNumber: studentData.rollNumber || "",
        parentName: studentData.parentName || "",
        parentPhone: studentData.parentPhone || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student:", err);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to load student details.",
      }).then(() => {
        navigate(-1);
      });
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudent(studentId);
    }
  }, [studentId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/${studentId}/edit-student`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Student details updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(-1);
    } catch (err) {
      console.error("Error updating student:", err);
      const errMsg = err.response?.data?.message || "Something went wrong.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6 border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Edit Student Details</h2>
          <p className="text-gray-500 text-sm mt-1">
            Update classroom, contact, and enrollment information.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 text-sm font-medium transition"
        >
          Cancel
        </button>
      </div>

      {message.text && (
        <div
          className={`p-3 mb-6 rounded-lg text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 block mb-1">Full Name</label>
          <div className="relative">
            <FaUser className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Student Name"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@mail.com"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Phone Number</label>
          <div className="relative">
            <FaPhone className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contact number"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Gender</label>
          <div className="relative">
            <FaVenusMars className="absolute top-3.5 left-3.5 text-gray-400" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* Roll Number */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Roll Number</label>
          <div className="relative">
            <FaIdBadge className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Roll number"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Class Number */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Assigned Class</label>
          <div className="relative">
            <FaDoorOpen className="absolute top-3.5 left-3.5 text-gray-400" />
            <select
              name="classNumber"
              value={formData.classNumber}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Assigned Section</label>
          <div className="relative">
            <FaUsers className="absolute top-3.5 left-3.5 text-gray-400" />
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parent Name */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Parent's Name</label>
          <div className="relative">
            <FaUserFriends className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Parent's Name"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Parent Phone */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Parent's Phone</label>
          <div className="relative">
            <FaPhone className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              placeholder="Parent's Contact"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
