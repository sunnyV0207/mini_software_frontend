import React, { useState } from "react";
import axios from "axios"
import Swal from "sweetalert2"
import {useNavigate,useParams} from 'react-router-dom'

const AddTeacher = () => {
  const navigate = useNavigate()
  const {schoolCode} = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    assignedClass: "",
    assignedSection: "",
    password: "",
    confirmPassword: "",
  });

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // console.log("Teacher Data:", formData);
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/add-teacher`,formData)
    .then((res)=>{
      // console.log(res)
      navigate('/school')
    })
    .catch((err)=>{
      // console.log(err)
      Swal.fire({
        title: "Error",
        icon: "error",
        text: err.response.data.message
      })
    })
  };

  return (
    <div className="flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-md border"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
          Add New Teacher
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-gray-700">
            Full Name
          </label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        {/* Assign Class + Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Assign Class
            </label>
            <select
              name="assignedClass"
              value={formData.assignedClass}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
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

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Assign Section
            </label>
            <select
              name="assignedSection"
              value={formData.assignedSection}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
              required
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password + Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Teacher
        </button>
      </form>
    </div>
  );
};

export  {AddTeacher};
