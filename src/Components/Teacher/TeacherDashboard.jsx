import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSchool,
  FaBookOpen,
  FaCalendarCheck,
  FaSignOutAlt,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaClock,
  FaClipboardCheck,
  FaChevronDown,
  FaChevronUp,
  FaPenNib,
  FaFileAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [manageExamsOpen, setManageExamsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [teacherClass, setTeacherClass] = useState(null);

  const [stats, setStats] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    status: "Active",
    schoolName: "",
    schoolCode: "",
    assignedClass: "Not Assigned",
    totalStudents: 0,
    subjectsCount: 0,
    subjects: [],
    attendancePercentage: 88,
  });

  const fetchTeacherData = async (teacherId, initialUser) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/${teacherId}/get-teacher`
      );
      const teacherData = response.data?.data || initialUser;
      setTeacher(teacherData);

      const assignedClassData = teacherData.class || null;
      setTeacherClass(assignedClassData);

      let schoolInfo = {};
      if (teacherData.school && typeof teacherData.school === "object") {
        schoolInfo = teacherData.school;
      } else if (initialUser?.school && typeof initialUser.school === "object") {
        schoolInfo = initialUser.school;
      } else if (teacherData.school && typeof teacherData.school === "string") {
        try {
          const schoolRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/${teacherData.school}/get-school`
          );
          schoolInfo = schoolRes.data?.data || {};
        } catch (e) {
          console.error("Error fetching school details:", e);
        }
      }

      const classInfo = assignedClassData
        ? `Class ${assignedClassData.classNumber} - Section ${assignedClassData.section}`
        : "Not Assigned";

      setStats({
        name: teacherData.name || initialUser?.name || "Teacher",
        email: teacherData.email || initialUser?.email || "",
        phone: teacherData.phone || initialUser?.phone || "N/A",
        gender: teacherData.gender || initialUser?.gender || "N/A",
        status: teacherData.status || initialUser?.status || "Active",
        schoolName: schoolInfo.schoolName || initialUser?.school?.schoolName || "School",
        schoolCode: schoolInfo.schoolCode || initialUser?.school?.schoolCode || "N/A",
        assignedClass: classInfo,
        totalStudents: assignedClassData?.students?.length || 0,
        subjectsCount: assignedClassData?.subjects?.length || 0,
        subjects: assignedClassData?.subjects || ["General"],
        attendancePercentage: 88,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      if (initialUser) {
        setTeacher(initialUser);
        const userSchool =
          initialUser.school && typeof initialUser.school === "object" ? initialUser.school : {};
        setStats((prev) => ({
          ...prev,
          name: initialUser.name || "Teacher",
          email: initialUser.email || "",
          phone: initialUser.phone || "N/A",
          gender: initialUser.gender || "N/A",
          status: initialUser.status || "Active",
          schoolName: userSchool.schoolName || "School",
          schoolCode: userSchool.schoolCode || "N/A",
        }));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "Teacher") {
        navigate("/login");
        return;
      }

      if (user.status !== "Active") {
        navigate("/login", {
          state: { message: "Your account is inactive. Please contact the school administrator." },
        });
        return;
      }

      setTeacher(user);
      fetchTeacherData(user._id, user);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Logout",
      text: "Are you sure you want to logout?",
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

  const navItemClass =
    "flex items-center gap-3 px-5 py-3 text-indigo-100 text-base font-medium rounded-xl hover:bg-[#3d3dbb] transition cursor-pointer";
  const activeNavClass =
    "flex items-center gap-3 px-5 py-3 bg-[#3d3dbb] text-white text-base font-semibold rounded-xl shadow-inner";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6ff]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold text-indigo-900">Loading Teacher Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6ff]">
      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#2b2b8f] flex flex-col z-40 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-indigo-800/40">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">EduNexus</h1>
            <p className="text-xs text-indigo-300 font-medium">Teacher Portal</p>
          </div>
          <button
            className="text-white text-2xl lg:hidden hover:text-gray-300"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 mt-6">
          <NavLink
            to="/teacher/dashboard"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaTachometerAlt size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/teacher/my-class"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaSchool size={18} />
            <span>My Class</span>
          </NavLink>

          <NavLink
            to="/teacher/attendance"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaCalendarCheck size={18} />
            <span>Attendance Register</span>
          </NavLink>

          {/* Expandable Manage Exams Accordion */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setManageExamsOpen(!manageExamsOpen)}
              className="flex items-center justify-between px-5 py-3 text-indigo-100 text-base font-medium rounded-xl hover:bg-[#3d3dbb] transition cursor-pointer w-full text-left"
            >
              <div className="flex items-center gap-3">
                <FaClipboardCheck size={18} />
                <span>Manage Exams</span>
              </div>
              <span className="text-xs text-indigo-300">
                {manageExamsOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </span>
            </button>

            {/* Sub-fields: Marks & Exam Papers */}
            <AnimatePresence>
              {manageExamsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1 pl-6 pr-2 py-1.5 overflow-hidden"
                >
                  <NavLink
                    to="/teacher/marks"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-[#3d3dbb] text-white font-semibold"
                          : "text-indigo-200 hover:text-white hover:bg-[#3d3dbb]/70"
                      }`
                    }
                  >
                    <FaPenNib size={14} className="text-indigo-300" />
                    <span>Marks</span>
                  </NavLink>

                  <div
                    className="flex items-center gap-3 px-4 py-2.5 text-indigo-200 hover:text-white hover:bg-[#3d3dbb]/70 rounded-xl text-sm font-medium transition cursor-pointer"
                    onClick={() => {
                      setMobileOpen(false);
                      Swal.fire({
                        icon: "info",
                        title: "Exam Papers",
                        text: "Exam Question Papers, Date Sheet, and Answer Keys repository.",
                        confirmButtonColor: "#4F46E5",
                      });
                    }}
                  >
                    <FaFileAlt size={14} className="text-indigo-300" />
                    <span>Exam Papers</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Sidebar Footer User Info & Logout */}
        <div className="mt-auto mb-6 px-4">
          <div className="bg-[#1f1f6e] p-3 rounded-xl mb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
              {stats.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">{stats.name}</p>
              <p className="text-indigo-300 text-xs truncate">{stats.schoolName}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-base font-semibold text-red-300 hover:text-red-200 hover:bg-red-600/20 transition rounded-xl"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="flex-1 lg:ml-64 p-6 md:p-10 overflow-y-auto">
        {/* Mobile Header Toggle */}
        <div className="flex lg:hidden items-center justify-between mb-6">
          <button
            className="text-3xl text-[#2b2b8f] focus:outline-none"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars />
          </button>
          <span className="text-xl font-bold text-[#2b2b8f]">Teacher Portal</span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2b2b8f]">
                Welcome, {stats.name}
              </h1>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-300 flex items-center gap-1">
                <FaCheckCircle size={12} /> {stats.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Here is your daily classroom overview and teaching activity.
            </p>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-indigo-100 flex items-center gap-3 self-start md:self-auto">
            <FaSchool className="text-indigo-600 text-xl" />
            <div>
              <p className="text-xs text-gray-500 font-medium">School</p>
              <p className="text-sm font-bold text-gray-800">{stats.schoolName}</p>
            </div>
          </div>
        </div>

        {/* ===================== TEACHER PROFILE & DETAILS CARD ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 mt-6 rounded-2xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-[#2b2b8f] flex items-center gap-2">
              <FaUserTie className="text-indigo-600" /> Teacher & Class Details
            </h2>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200">
              Code: {stats.schoolCode}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5">
                <FaEnvelope size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email Address</p>
                <p className="font-semibold text-gray-800 break-all">{stats.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-lg mt-0.5">
                <FaPhone size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Contact Number</p>
                <p className="font-semibold text-gray-800">{stats.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg mt-0.5">
                <FaChalkboardTeacher size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Class Teacher Of</p>
                <p className="font-bold text-indigo-700">{stats.assignedClass}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================== STATS CARDS ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard
            title="Class Assigned"
            value={teacherClass ? `Class ${teacherClass.classNumber}-${teacherClass.section}` : "None"}
            color="bg-gradient-to-r from-blue-600 to-indigo-600"
            icon={<FaSchool size={28} />}
            subtitle="Current primary classroom"
          />

          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            color="bg-gradient-to-r from-purple-600 to-indigo-600"
            icon={<FaUserGraduate size={28} />}
            subtitle="Enrolled in your class"
          />

          <StatCard
            title="Subjects"
            value={stats.subjectsCount}
            color="bg-gradient-to-r from-sky-500 to-blue-600"
            icon={<FaBookOpen size={28} />}
            subtitle="Class curriculum subjects"
          />

          <StatCard
            title="Attendance"
            value={`${stats.attendancePercentage}%`}
            color="bg-gradient-to-r from-emerald-500 to-teal-600"
            icon={<FaCalendarCheck size={28} />}
            subtitle="Average student attendance"
          />
        </div>

        {/* ===================== ATTENDANCE & QUICK OVERVIEW ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Circular Attendance Metric */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-xl font-bold text-[#2b2b8f] mb-2">Class Attendance Rate</h2>
            <p className="text-gray-500 text-sm mb-6">Today's recorded presence</p>

            <div className="relative w-44 h-44 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full transition-all duration-700"
                style={{
                  background: `conic-gradient(#2b2b8f ${stats.attendancePercentage}%, #e2e8f0 ${stats.attendancePercentage}%)`,
                }}
              ></div>

              <div className="absolute w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-extrabold text-[#2b2b8f]">
                  {stats.attendancePercentage}%
                </span>
                <span className="text-xs text-gray-500 font-medium">Present</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2b2b8f]"></span>
                <span className="text-gray-700 font-medium">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                <span className="text-gray-700 font-medium">Absent</span>
              </div>
            </div>
          </motion.div>

          {/* Classroom Overview & Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h2 className="text-xl font-bold text-[#2b2b8f] flex items-center gap-2">
                  <FaBookOpen className="text-indigo-600" /> Subjects & Classroom Overview
                </h2>
                <span className="text-xs font-semibold text-gray-500">
                  {stats.assignedClass}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Manage your class roster, monitor daily student attendance, and coordinate classroom
                activities. Here are the subjects associated with your assigned class:
              </p>

              {/* Subject Badges */}
              <div className="flex flex-wrap gap-2.5 mb-8">
                {stats.subjects && stats.subjects.length > 0 ? (
                  stats.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm rounded-lg border border-indigo-200 transition"
                    >
                      📘 {sub}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No subjects configured yet.</p>
                )}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-[#f8faff] p-4 rounded-xl border border-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 text-white rounded-xl">
                  <FaClock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Quick Daily Checklist</p>
                  <p className="text-xs text-gray-500">
                    Verify today's attendance and student records.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/teacher/attendance")}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition cursor-pointer"
                >
                  Mark Attendance →
                </button>
                <button
                  onClick={() => navigate("/teacher/marks")}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-md transition cursor-pointer"
                >
                  Manage Marks →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// ===================== STAT CARD COMPONENT =====================
const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${color} text-white p-6 rounded-2xl shadow-md transition hover:shadow-xl flex flex-col justify-between`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white/90">{title}</p>
          <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl text-white">{icon}</div>
      </div>

      {subtitle && <p className="text-xs text-white/80 mt-4 pt-3 border-t border-white/15">{subtitle}</p>}
    </motion.div>
  );
};
