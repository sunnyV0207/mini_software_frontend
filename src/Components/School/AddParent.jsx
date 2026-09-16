import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaBriefcase,
  FaMapMarkerAlt,
  FaLock,
  FaUserGraduate,
  FaTimes,
  FaCheck
} from "react-icons/fa";

export const AddParent = () => {
  const navigate = useNavigate();
  const { schoolCode } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
    address: "",
    password: "",
    confirmPassword: "",
    children: [], // Array of selected student IDs
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(true);

  // Fetch school students for linking
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const targetSchoolCode =
          schoolCode ||
          (typeof loggedUser.school === "object"
            ? loggedUser.school?.schoolCode
            : undefined);

        if (targetSchoolCode) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/${targetSchoolCode}/students/get-students`
          );
          const studentList = Array.isArray(res.data?.data) ? res.data.data : [];
          setAvailableStudents(studentList);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setFetchingStudents(false);
      }
    };

    fetchStudents();
  }, [schoolCode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleStudentSelection = (studentId) => {
    setFormData((prev) => {
      const exists = prev.children.includes(studentId);
      return {
        ...prev,
        children: exists
          ? prev.children.filter((id) => id !== studentId)
          : [...prev.children, studentId],
      };
    });
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
      const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const targetSchoolCode =
        schoolCode ||
        (typeof loggedUser.school === "object"
          ? loggedUser.school?.schoolCode
          : undefined);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parent/add-parent`,
        {
          ...formData,
          schoolCode: targetSchoolCode,
        },
        { withCredentials: true }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Parent registered successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(targetSchoolCode ? `/school/${targetSchoolCode}/parents` : "/school");
    } catch (err) {
      console.error("Error adding parent:", err);
      const errMsg = err.response?.data?.message || "Something went wrong.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = availableStudents.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.rollNumber && String(s.rollNumber).toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.class && `Class ${s.class.classNumber}-${s.class.section}`.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6 border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-indigo-700">Add New Parent</h2>
        <p className="text-gray-500 text-sm mt-1">
          Register parent details and link them with their enrolled children in this school.
        </p>
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

      <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 block mb-1">Parent's Full Name</label>
          <div className="relative">
            <FaUser className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
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
              placeholder="parent@example.com"
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

        {/* Occupation */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Occupation (Optional)</label>
          <div className="relative">
            <FaBriefcase className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="e.g. Engineer, Business"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 block mb-1">Address / Residence (Optional)</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Residential address"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* ================= LINK CHILDREN (STUDENTS) ================= */}
        <div className="md:col-span-2 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <label className="font-bold text-indigo-900 flex items-center gap-2">
                <FaUserGraduate className="text-indigo-600" /> Link Children (Students)
              </label>
              <p className="text-xs text-gray-500">
                Select one or multiple students belonging to this parent.
              </p>
            </div>

            {formData.children.length > 0 && (
              <span className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">
                {formData.children.length} Student{formData.children.length > 1 ? "s" : ""} Selected
              </span>
            )}
          </div>

          {/* Student Search */}
          <input
            type="text"
            placeholder="Search students by name, roll no, or class..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full p-2.5 mb-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-300"
          />

          {/* Student Selector Grid */}
          {fetchingStudents ? (
            <p className="text-sm text-gray-500 py-3 text-center">Loading school students...</p>
          ) : availableStudents.length === 0 ? (
            <p className="text-sm text-gray-500 py-3 text-center">
              No students found in this school. You can still add the parent now and link students later.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
              {filteredStudents.map((st) => {
                const isSelected = formData.children.includes(st._id);
                return (
                  <div
                    key={st._id}
                    onClick={() => toggleStudentSelection(st._id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate">{st.name}</p>
                      <p className={`text-xs ${isSelected ? "text-indigo-100" : "text-gray-500"}`}>
                        {st.class ? `Class ${st.class.classNumber}-${st.class.section}` : "No Class"} • Roll #{st.rollNumber || "N/A"}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-white text-indigo-600" : "border border-gray-300 text-transparent"
                      }`}
                    >
                      <FaCheck size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Create Password</label>
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">Confirm Password</label>
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3.5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? "Registering Parent..." : "Add Parent"}
          </button>
        </div>
      </form>
    </div>
  );
};
