import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaBriefcase,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaCheck
} from "react-icons/fa";

export const EditParent = () => {
  const navigate = useNavigate();
  const { parentId } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
    address: "",
    children: [], // array of selected student IDs
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch parent
        const parentRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/parent/${parentId}/get-parent`
        );
        const parentData = parentRes.data?.data;

        const currentChildIds = Array.isArray(parentData.children)
          ? parentData.children.map((c) => (typeof c === "object" ? c._id : c))
          : [];

        setFormData({
          fullName: parentData.name || "",
          email: parentData.email || "",
          phone: parentData.phone || "",
          gender: parentData.gender || "",
          occupation: parentData.occupation || "",
          address: parentData.address || "",
          children: currentChildIds,
        });

        // 2. Fetch school students
        const schoolCode =
          parentData.school?.schoolCode ||
          JSON.parse(localStorage.getItem("user") || "{}").school?.schoolCode;

        if (schoolCode) {
          const studentsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/students/get-students`
          );
          setAvailableStudents(Array.isArray(studentsRes.data?.data) ? studentsRes.data.data : []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading parent details:", err);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to load parent details.",
        }).then(() => navigate(-1));
      }
    };

    if (parentId) {
      fetchData();
    }
  }, [parentId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/parent/${parentId}/edit-parent`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Parent details updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(-1);
    } catch (err) {
      console.error("Error updating parent:", err);
      const errMsg = err.response?.data?.message || "Failed to update parent.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = availableStudents.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.rollNumber && String(s.rollNumber).toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.class && `Class ${s.class.classNumber}-${s.class.section}`.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading parent details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6 border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Edit Parent Details</h2>
          <p className="text-gray-500 text-sm mt-1">
            Update parent contact info and modify linked children connections.
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
          {availableStudents.length === 0 ? (
            <p className="text-sm text-gray-500 py-3 text-center">
              No students found in this school.
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
