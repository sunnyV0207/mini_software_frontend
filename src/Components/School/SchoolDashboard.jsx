import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaSchool,
  FaSignOutAlt,
  FaBookOpen,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowRight,
  FaChartLine,
  FaUserTie,
  FaLayerGroup,
  FaIdCard,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export const SchoolDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [stats, setStats] = useState({
    schoolName: "",
    schoolCode: "",
    established: "",
    phone: "",
    email: "",
    address: "",
    teachers: 0,
    students: 0,
    parents: 0,
    classes: 0,
    attendance: 92,
  });

  const fetchSchoolData = async (schoolId, userObj) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolId}/get-school`
      );
      const data = response.data.data;
      setSchool(data);
      setStats({
        schoolName: data.schoolName || userObj?.school?.schoolName || "School Name",
        schoolCode: data.schoolCode || userObj?.school?.schoolCode || "N/A",
        established: data.established
          ? new Date(data.established).getFullYear()
          : "N/A",
        phone: data.contactNumber || "N/A",
        email: data.email || "N/A",
        address: data.address || "No address specified",
        teachers: Array.isArray(data.teachers) ? data.teachers.length : 0,
        students: Array.isArray(data.students) ? data.students.length : 0,
        parents: Array.isArray(data.parents) ? data.parents.length : 0,
        classes: Array.isArray(data.classes) ? data.classes.length : 0,
        attendance: 92,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching school data:", error);
      setLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setCurrentUser(parsedUser);

    if (parsedUser.role !== "Principal") {
      navigate("/login");
      return;
    }

    if (parsedUser.status !== "Active") {
      navigate("/login", {
        state: { message: "User has been blocked by Admin. Kindly contact admin" },
      });
      return;
    }

    if (parsedUser.school) {
      const schoolId =
        typeof parsedUser.school === "object"
          ? parsedUser.school._id
          : parsedUser.school;
      fetchSchoolData(schoolId, parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    Swal.fire({
      icon: "question",
      title: "Logout Confirmation",
      text: "Are you sure you want to sign out from the School Portal?",
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
    "flex items-center gap-3.5 px-4 py-3 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all text-sm";
  const activeNavClass =
    "flex items-center gap-3.5 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 text-sm";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold text-lg animate-pulse">
          Loading School Portal...
        </p>
      </div>
    );
  }

  const schoolCode = school?.schoolCode || stats.schoolCode;
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#161748] via-[#1b1c5a] to-[#12133e] flex flex-col 
          z-40 transform transition-transform duration-300 shadow-2xl border-r border-indigo-900/40
          ${mobileOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-indigo-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              E
            </div>
            <div>
              <h1 className="text-xl text-white font-extrabold tracking-tight">
                EduNexus
              </h1>
              <p className="text-[11px] text-indigo-300 font-medium">
                School Management
              </p>
            </div>
          </div>

          <button
            className="text-indigo-300 hover:text-white text-xl lg:hidden p-1"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1.5 px-4 mt-6">
          <NavLink
            to="/school/dashboard"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaTachometerAlt size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to={`/school/${schoolCode}/teachers`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaChalkboardTeacher size={18} />
            <span>Manage Teachers</span>
          </NavLink>

          <NavLink
            to={`/school/${schoolCode}/students`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaUserGraduate size={18} />
            <span>Manage Students</span>
          </NavLink>

          <NavLink
            to={`/school/${schoolCode}/parents`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaUsers size={18} />
            <span>Manage Parents</span>
          </NavLink>

          <NavLink
            to={`/school/${schoolCode}/classes`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => (isActive ? activeNavClass : navItemClass)}
          >
            <FaSchool size={18} />
            <span>Manage Classes</span>
          </NavLink>
        </nav>

        {/* User Card & Logout */}
        <div className="mt-auto mb-6 px-4">
          <div className="bg-indigo-950/60 border border-indigo-800/50 p-3.5 rounded-2xl mb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <FaUserTie />
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-bold truncate">
                {currentUser?.name || "Principal"}
              </p>
              <p className="text-indigo-300 text-xs truncate">
                {stats.schoolName}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center w-full gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-300 hover:text-white hover:bg-red-600/80 transition rounded-xl"
          >
            <FaSignOutAlt size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Mobile Header Toggle */}
        <div className="flex lg:hidden items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <button
            className="text-2xl text-indigo-700 focus:outline-none"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{stats.schoolName}</span>
          </div>
        </div>

        {/* WELCOME BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome, {currentUser?.name || "Principal"}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                <FaCheckCircle size={12} /> Active Principal
              </span>
            </div>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              {currentDate} • School Administration Portal
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <FaSchool />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase">
                  School Code
                </p>
                <p className="text-sm font-bold text-gray-800">{schoolCode}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RESTRUCTURED SCHOOL DETAILS HERO CARD (Full Address & Prominent Info) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 sm:p-8 mt-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* School Name & Key Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-inner">
                  <FaSchool />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {stats.schoolName}
                  </h2>
                  <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                    Official Institutional Coordinates & Contact Directory
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <FaIdCard size={12} /> Code: {schoolCode}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                <FaCalendarAlt size={12} /> Est. {stats.established}
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Official Email */}
            <div className="flex items-start gap-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl mt-0.5 flex-shrink-0">
                <FaEnvelope size={17} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  Official Email
                </p>
                <p className="font-semibold text-gray-900 break-all text-sm mt-0.5">
                  {stats.email}
                </p>
              </div>
            </div>

            {/* Contact Phone */}
            <div className="flex items-start gap-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 hover:border-emerald-100 transition">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mt-0.5 flex-shrink-0">
                <FaPhone size={17} />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  Phone / Helpline
                </p>
                <p className="font-semibold text-gray-900 text-sm mt-0.5">
                  {stats.phone}
                </p>
              </div>
            </div>

            {/* Full Campus Address (Full Visibility & Multi-line Wrap) */}
            <div className="flex items-start gap-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 hover:border-amber-100 transition md:col-span-2 lg:col-span-1">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl mt-0.5 flex-shrink-0">
                <FaMapMarkerAlt size={17} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  Full Campus Address
                </p>
                <p className="font-medium text-gray-900 text-sm mt-0.5 leading-relaxed break-words">
                  {stats.address}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 STATS CARDS (Clean Metric Cards - Without "+ Add" clutter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <ModernStatCard
            title="Teachers"
            value={stats.teachers}
            subtitle="Active Faculty Members"
            gradient="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700"
            icon={<FaChalkboardTeacher size={24} />}
            onManage={() => navigate(`/school/${schoolCode}/teachers`)}
          />

          <ModernStatCard
            title="Students"
            value={stats.students}
            subtitle="Total Enrolled Students"
            gradient="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800"
            icon={<FaUserGraduate size={24} />}
            onManage={() => navigate(`/school/${schoolCode}/students`)}
          />

          <ModernStatCard
            title="Parents"
            value={stats.parents}
            subtitle="Registered Guardians"
            gradient="bg-gradient-to-br from-pink-600 via-rose-600 to-rose-700"
            icon={<FaUsers size={24} />}
            onManage={() => navigate(`/school/${schoolCode}/parents`)}
          />

          <ModernStatCard
            title="Classes"
            value={stats.classes}
            subtitle="Configured Grade Sections"
            gradient="bg-gradient-to-br from-teal-600 via-emerald-600 to-emerald-700"
            icon={<FaBookOpen size={24} />}
            onManage={() => navigate(`/school/${schoolCode}/classes`)}
          />
        </div>

        {/* ANALYTICS & ADMINISTRATIVE QUICK HUB ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* TODAY ATTENDANCE GAUGE WIDGET */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaChartLine className="text-indigo-600" /> Attendance Overview
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Today
                </span>
              </div>

              {/* Progress Radial Ring */}
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600 transition-all duration-1000 ease-out"
                      strokeDasharray={`${stats.attendance}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-indigo-900">
                      {stats.attendance}%
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold uppercase">
                      Present Rate
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-semibold">Estimated Present</p>
                  <p className="text-base font-bold text-emerald-900 mt-0.5">
                    {Math.round((stats.students * stats.attendance) / 100)} Students
                  </p>
                </div>
                <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                  <p className="text-xs text-rose-600 font-semibold">Estimated Absent</p>
                  <p className="text-base font-bold text-rose-900 mt-0.5">
                    {stats.students - Math.round((stats.students * stats.attendance) / 100)} Students
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK SHORTCUTS & ACTION HUB */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaLayerGroup className="text-indigo-600" /> Administrative Quick Hub
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Instant shortcuts for onboarding, registration, and classroom management
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionTile
                  icon={<FaUserGraduate className="text-indigo-600" size={20} />}
                  bgIcon="bg-indigo-50"
                  title="Enroll New Student"
                  desc="Register student, assign roll number & class"
                  onClick={() => navigate(`/school/${schoolCode}/students/add`)}
                />

                <QuickActionTile
                  icon={<FaChalkboardTeacher className="text-blue-600" size={20} />}
                  bgIcon="bg-blue-50"
                  title="Onboard Teacher"
                  desc="Create faculty profile & assign class"
                  onClick={() => navigate(`/school/${schoolCode}/teachers/add`)}
                />

                <QuickActionTile
                  icon={<FaUsers className="text-pink-600" size={20} />}
                  bgIcon="bg-pink-50"
                  title="Register Parent"
                  desc="Add guardian details & link student children"
                  onClick={() => navigate(`/school/${schoolCode}/parents/add`)}
                />

                <QuickActionTile
                  icon={<FaSchool className="text-emerald-600" size={20} />}
                  bgIcon="bg-emerald-50"
                  title="Configure Class"
                  desc="Create new grade, section & curriculum subjects"
                  onClick={() => navigate(`/school/${schoolCode}/classes/add`)}
                />
              </div>
            </div>

            {/* School Metrics Summary Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <span>
                Faculty to Student Ratio:{" "}
                <strong>
                  {stats.teachers > 0
                    ? `1 : ${Math.round(stats.students / stats.teachers)}`
                    : "N/A"}
                </strong>
              </span>

              <span>
                Average Students per Class:{" "}
                <strong>
                  {stats.classes > 0
                    ? Math.round(stats.students / stats.classes)
                    : 0}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ===========================================================
// MODERN STAT CARD COMPONENT (Clean View All)
// ===========================================================
const ModernStatCard = ({
  title,
  value,
  subtitle,
  gradient,
  icon,
  onManage,
}) => {
  return (
    <div
      onClick={onManage}
      className={`${gradient} text-white p-6 rounded-3xl shadow-lg shadow-indigo-900/10 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            {icon}
          </div>
        </div>

        <h3 className="text-4xl font-extrabold mt-3 tracking-tight">{value}</h3>
        <p className="text-xs text-white/80 mt-1 font-medium">{subtitle}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
        <span className="text-xs font-bold text-white/90 group-hover:text-white flex items-center gap-1.5 transition">
          View All {title} <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
};

// ===========================================================
// QUICK ACTION TILE COMPONENT
// ===========================================================
const QuickActionTile = ({ icon, bgIcon, title, desc, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 rounded-2xl ${bgIcon} flex items-center justify-center shadow-sm group-hover:scale-105 transition`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-700 transition">
            {title}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">{desc}</p>
        </div>
      </div>

      <div className="w-7 h-7 rounded-full bg-white text-gray-400 group-hover:text-indigo-600 flex items-center justify-center shadow-xs border border-gray-100 group-hover:border-indigo-200 transition">
        <FaArrowRight size={10} />
      </div>
    </div>
  );
};
