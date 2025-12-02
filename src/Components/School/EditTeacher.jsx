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

export const EditTeacher = () => {
  const navigate = useNavigate();
  const {teacherId} = useParams()

  const [teacher,setTeacher] = useState(null)
  const [formData,setFormData] = useState({
    fullName: "",
    email: "",
    assignedClass: "",
    assignedSection: "",
    phone: "",
    gender: ""
  })
  const [message,setMessage] = useState("")
  const [loading,setLoading] = useState(true)
  const [saving,setSaving] = useState(false)

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

  const fetchTeacher = (teacherId) => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/${teacherId}/get-teacher`)
    .then((res)=>{
        // console.log(res)
        const teacher = res.data.data;
        setTeacher(teacher)
        setFormData((prev)=>({
          ...prev,
          fullName: teacher.name || "",
          email: teacher.email || "",
          assignedClass: teacher.class.classNumber || "",
          assignedSection: teacher.class.section || "",
          phone: teacher.phone || "",
          gender: teacher.gender || ""
        }))
        setLoading(false)
    })
    .catch((err)=>{
        console.log(err)
        setLoading(false)
        navigate('/school')
    })
  }

  useEffect(()=>{
    fetchTeacher(teacherId)
  },[])

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
    setSaving(true)
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/${teacherId}/edit-teacher`,
        formData
      );

      // console.log(res)

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
      setMessage({ type: "error", text: message });
    } finally{
        setSaving(false)
    }
  };

  if(loading){
    return (
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Edit Teacher details
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

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};
