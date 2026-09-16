import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaSchool,
  FaUserGraduate,
  FaBookOpen,
  FaSignOutAlt,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaUserFriends,
  FaEye,
  FaCheckCircle,
  FaFilter,
  FaUserTie,
  FaPrint,
  FaVenusMars,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export const MyClass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasClass, setHasClass] = useState(false);
  const [classData, setClassData] = useState(null);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    boys: 0,
    girls: 0,
    activeStudents: 0,
    subjectsCount: 0,
    attendanceRate: 92,
  });

  const [teacherInfo, setTeacherInfo] = useState({
    name: "",
    email: "",
    schoolName: "",
    schoolCode: "",
  });

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null); // For Profile Modal
  const [showGuardiansModal, setShowGuardiansModal] = useState(false);

  const fetchMyClassData = async (teacherId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/${teacherId}/my-class`
      );
      const data = res.data?.data;

      if (data?.hasClass) {
        setHasClass(true);
        setClassData(data.classData);
        setMetrics(data.metrics);
        setTeacherInfo((prev) => ({
          ...prev,
          schoolName: data.classData.school?.schoolName || prev.schoolName,
          schoolCode: data.classData.school?.schoolCode || prev.schoolCode,
        }));
      } else {
        setHasClass(false);
      }
    } catch (err) {
      console.error("Error fetching my class data:", err);
      setHasClass(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userStr);

    if (parsedUser.role !== "Teacher") {
      navigate("/login");
      return;
    }

    setTeacherInfo({
      name: parsedUser.name || "Teacher",
      email: parsedUser.email || "",
      schoolName: parsedUser.school?.schoolName || "School",
      schoolCode: parsedUser.school?.schoolCode || "N/A",
    });

    fetchMyClassData(parsedUser._id);
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to sign out from the Teacher Portal?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  const studentsList = Array.isArray(classData?.students)
    ? classData.students
    : [];

  const filteredStudents = studentsList.filter((s) => {
    if (!s) return false;
    const term = search.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.phone && s.phone.toLowerCase().includes(term)) ||
      (s.rollNumber && String(s.rollNumber).toLowerCase().includes(term)) ||
      (s.parentName && s.parentName.toLowerCase().includes(term));

    const matchesGender =
      genderFilter === "All" ||
      (s.gender && s.gender.toLowerCase() === genderFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (s.status && s.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesGender && matchesStatus;
  });

  const handlePrintRoster = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold text-lg animate-pulse">
          Loading Classroom Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800">
      {/* ===================== TOP NAVIGATION BAR ===================== */}
      <header className="bg-[#2b2b8f] text-white shadow-lg sticky top-0 z-40 border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          {/* Left: Brand & Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition border border-white/10 cursor-pointer"
              title="Return to Dashboard"
            >
              <FaArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                E
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">
                  EduNexus
                </h1>
                <p className="text-[11px] text-indigo-200 font-medium">
                  Classroom Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Right: Teacher Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                {teacherInfo.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[140px]">
                  {teacherInfo.name}
                </p>
                <p className="text-[10px] text-indigo-200 truncate max-w-[140px]">
                  {teacherInfo.schoolName}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-red-500/30 cursor-pointer"
            >
              <FaSignOutAlt size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasClass ? (
          /* NO CLASS ASSIGNED EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16 text-center max-w-2xl mx-auto mt-10"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-4xl mb-5 border border-amber-200">
              <FaExclamationCircle />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              No Primary Classroom Assigned
            </h2>
            <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">
              You are currently not designated as a primary Class Teacher for any grade or section. Please contact your <strong>School Principal</strong> to assign you to a classroom.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/teacher/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* CLASSROOM HERO HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Class {classData.classNumber} - Section {classData.section}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    <FaCheckCircle size={12} /> Class Teacher
                  </span>
                </div>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  {teacherInfo.schoolName} • Classroom Command & Student Roster
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center gap-2.5 self-start md:self-auto">
                <button
                  onClick={() => setShowGuardiansModal(true)}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition"
                >
                  <FaUserFriends className="text-indigo-600" />
                  <span>Guardians Directory</span>
                </button>

                <button
                  onClick={handlePrintRoster}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition"
                >
                  <FaPrint />
                  <span>Print Roster</span>
                </button>
              </div>
            </motion.div>

            {/* CURRICULUM & SUBJECTS BAR */}
            {classData.subjects && classData.subjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 mt-6 flex flex-wrap items-center gap-2.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
                  <FaBookOpen className="text-indigo-600" />
                  <span>Curriculum Subjects:</span>
                </div>
                {classData.subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-100 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {sub}
                  </span>
                ))}
              </motion.div>
            )}

            {/* 4 SUMMARY METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {/* Total Enrolled */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Total Students
                    </p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                      {metrics.totalStudents}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    <FaUserGraduate />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Enrolled in Class</span>
                  <span className="font-semibold text-indigo-600">100% Assigned</span>
                </div>
              </motion.div>

              {/* Boys Count */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Male Students
                    </p>
                    <h3 className="text-3xl font-extrabold text-blue-600 mt-1">
                      {metrics.boys}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    <FaVenusMars />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Gender Ratio</span>
                  <span className="font-semibold text-blue-600">
                    {metrics.totalStudents > 0
                      ? Math.round((metrics.boys / metrics.totalStudents) * 100)
                      : 0}
                    % Boys
                  </span>
                </div>
              </motion.div>

              {/* Girls Count */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Female Students
                    </p>
                    <h3 className="text-3xl font-extrabold text-pink-600 mt-1">
                      {metrics.girls}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    <FaVenusMars />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Gender Ratio</span>
                  <span className="font-semibold text-pink-600">
                    {metrics.totalStudents > 0
                      ? Math.round((metrics.girls / metrics.totalStudents) * 100)
                      : 0}
                    % Girls
                  </span>
                </div>
              </motion.div>

              {/* Active Students */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Active Status
                    </p>
                    <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
                      {metrics.activeStudents}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    <FaCheckCircle />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Account Health</span>
                  <span className="font-semibold text-emerald-600">
                    {metrics.activeStudents} of {metrics.totalStudents} Active
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ===================== STUDENT ROSTER SECTION ===================== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 overflow-hidden"
            >
              {/* Filter Toolbar */}
              <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaUserGraduate className="text-indigo-600" />
                    <span>Class Student Roster</span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold ml-1">
                      {filteredStudents.length} Students
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Search and inspect enrolled student profiles and contact information
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Box */}
                  <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search name, roll no, email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                    />
                  </div>

                  {/* Gender Filter */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                    <FaFilter className="text-gray-400 text-xs" />
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Genders</option>
                      <option value="Male">Boys Only</option>
                      <option value="Female">Girls Only</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active Only</option>
                      <option value="Inactive">Inactive Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                      <th className="py-3.5 px-6">Roll No</th>
                      <th className="py-3.5 px-6">Student</th>
                      <th className="py-3.5 px-6">Gender</th>
                      <th className="py-3.5 px-6">Contact</th>
                      <th className="py-3.5 px-6">Guardian Details</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-xl mb-3">
                            <FaSearch />
                          </div>
                          <p className="font-semibold text-gray-600">No students found</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try adjusting your search criteria or filters.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st, idx) => (
                        <tr
                          key={st._id || idx}
                          className="hover:bg-indigo-50/40 transition duration-150 group"
                        >
                          {/* Roll Number */}
                          <td className="py-4 px-6 font-bold text-gray-900">
                            <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-mono">
                              #{st.rollNumber || "N/A"}
                            </span>
                          </td>

                          {/* Student Name & Email */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                {st.name ? st.name.charAt(0).toUpperCase() : "S"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                  {st.name}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <FaEnvelope size={10} className="text-gray-400" />
                                  <span>{st.email}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Gender */}
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                st.gender === "Female"
                                  ? "bg-pink-50 text-pink-700 border border-pink-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {st.gender}
                            </span>
                          </td>

                          {/* Student Phone */}
                          <td className="py-4 px-6">
                            {st.phone ? (
                              <span className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                                <FaPhone size={10} className="text-gray-400" />
                                {st.phone}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No phone</span>
                            )}
                          </td>

                          {/* Parent Details */}
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-gray-800 text-xs">
                                {st.parentName || "N/A"}
                              </p>
                              {st.parentPhone && (
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <FaPhone size={9} className="text-gray-400" />
                                  {st.parentPhone}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                st.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  st.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                                }`}
                              ></span>
                              {st.status || "Active"}
                            </span>
                          </td>

                          {/* View Profile Action */}
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => setSelectedStudent(st)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                              <FaEye size={12} />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* ===================== STUDENT PROFILE MODAL ===================== */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden p-6 sm:p-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-gray-500">
                    Roll #{selectedStudent.rollNumber} • Class {classData?.classNumber}-{classData?.section}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="mt-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 font-medium">Account Status</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    selectedStudent.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedStudent.status || "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 font-medium">Gender</span>
                <span className="font-bold text-gray-800">{selectedStudent.gender || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 font-medium">Student Email</span>
                <span className="font-bold text-gray-800 break-all">{selectedStudent.email}</span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 font-medium">Student Contact</span>
                <span className="font-bold text-gray-800">{selectedStudent.phone || "N/A"}</span>
              </div>

              {selectedStudent.parentName && (
                <div className="flex items-center gap-3 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                  <FaUserFriends className="text-indigo-600 text-base flex-shrink-0" />
                  <div>
                    <p className="text-xs text-indigo-500 font-medium">Guardian / Parent</p>
                    <p className="font-bold text-indigo-950 mt-0.5">
                      {selectedStudent.parentName} {selectedStudent.parentPhone && `(${selectedStudent.parentPhone})`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUARDIANS DIRECTORY MODAL */}
      {showGuardiansModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowGuardiansModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden p-6 sm:p-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaUserFriends className="text-indigo-600" /> Guardians Directory
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Emergency and contact list for Class {classData?.classNumber}-{classData?.section}
                </p>
              </div>

              <button
                onClick={() => setShowGuardiansModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto space-y-2.5 pr-1">
              {studentsList.map((st, idx) => (
                <div
                  key={st._id || idx}
                  className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{st.name}</p>
                    <p className="text-gray-500">
                      Parent: <strong className="text-gray-700">{st.parentName || "N/A"}</strong>
                    </p>
                  </div>

                  {st.parentPhone ? (
                    <a
                      href={`tel:${st.parentPhone}`}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 hover:bg-indigo-100 transition"
                    >
                      <FaPhone size={10} /> {st.parentPhone}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No Phone</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowGuardiansModal(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
