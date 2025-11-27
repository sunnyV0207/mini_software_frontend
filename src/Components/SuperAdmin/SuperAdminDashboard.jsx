import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSchool,
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaPlus,
  FaCog,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/stats`);
        // console.log(response.data.data);
        setStats(response.data.data);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // setLoading(false);
      }
    };

    const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "Super Admin") {
            // Redirect to login or unauthorized page
            navigate('/login');
        }else{
            setCheckingAuth(false);
        }

    fetchStats();
    },[]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const performLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        performLogout();
      }
    });
  };

  if(!checkingAuth){
    return (
    <div className="bg-gray-100 min-h-screen flex">

      {/* ===================== FIXED SIDEBAR ===================== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-indigo-700">
          <h1 className="text-2xl font-bold tracking-wide">EduNexus</h1>
          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-4 px-5 text-lg">
          <a onClick={()=>navigate('dashboard')} className="flex items-center gap-3 hover:text-indigo-300 transition cursor-pointer">
            <FaUserShield /> Dashboard
          </a>
          <a onClick={()=>navigate('/super-admin/manage-schools')} className="flex items-center gap-3 hover:text-indigo-300 transition cursor-pointer">
            <FaSchool /> Manage Schools
          </a>
          <a className="flex items-center gap-3 hover:text-indigo-300 transition cursor-pointer">
            <FaUsers /> Manage Principals
          </a>
          <a className="flex items-center gap-3 hover:text-indigo-300 transition cursor-pointer">
            <FaFileAlt /> Reports
          </a>
          <a className="flex items-center gap-3 hover:text-indigo-300 transition cursor-pointer">
            <FaCog /> Settings
          </a>

          {/* NEW: LOGOUT OPTION */}
          <button onClick={handleLogout} className="flex items-center gap-3 hover:text-red-300 text-red-400 transition cursor-pointer mt-4">
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className="flex-1 p-6 ml-0 lg:ml-64 overflow-y-auto h-screen">

        {/* ----- MOBILE TOP BAR ----- */}
        <div className="flex lg:hidden items-center justify-between mb-6">
          <button onClick={toggleSidebar}>
            <FaBars size={26} />
          </button>
          <h1 className="text-2xl font-bold text-indigo-900">Super Admin</h1>
        </div>

        {/* ----- HEADER AREA ----- */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-900">Welcome, Super Admin</h1>
          <p className="text-gray-700 mt-1 text-lg">
            Manage platform-wide schools, principals, teachers, and overall system activity.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <button onClick={()=>navigate('/super-admin/add-school')} className="flex items-center gap-3 bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-3 rounded-xl shadow-md transition text-lg">
              <FaPlus /> Add School
            </button>

            <button onClick={()=>navigate('/super-admin/add-principal')} className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-md transition text-lg">
              <FaPlus /> Add Principal
            </button>
          </div>
        </div>

        {/* ===================== DASHBOARD CARDS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Schools"
            count={stats ? stats.SchoolCount : '0'}
            icon={<FaSchool size={35} />}
            color="bg-indigo-600"
          />

          <DashboardCard
            title="Principals"
            count={stats ? stats.PrincipalCount : '0'}
            icon={<FaUserTie size={35} />}
            color="bg-green-600"
          />

          <DashboardCard
            title="Teachers"
            count={stats ? stats.TeacherCount : '0'}
            icon={<FaChalkboardTeacher size={35} />}
            color="bg-blue-600"
          />

          <DashboardCard
            title="Students"
            count={stats ? stats.StudentCount : '0'}
            icon={<FaUserGraduate size={35} />}
            color="bg-purple-600"
          />

          <DashboardCard
            title="Parents"
            count={stats ? stats.ParentCount : '0'}
            icon={<FaUsers size={35} />}
            color="bg-pink-600"
          />

          <DashboardCard
            title="Admins"
            count={stats ? stats.SuperAdminCount : '0'}
            icon={<FaUserShield size={35} />}
            color="bg-gray-700"
          />
        </div>

        {/* =================== OVERVIEW PANEL =================== */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">System Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            Stay informed with live system statistics, user analytics, and platform-wide insights.  
            This panel can later be enhanced with interactive charts, logs, and usage trends.
          </p>
        </div>
      </main>
    </div>
  );
}else{
    return (
      <div className="h-screen flex items-center justify-center text-xl text-indigo-700">
        Loading...
      </div>
    );
}
};



/* ===================== CARD COMPONENT ===================== */
const DashboardCard = ({ title, count, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-xl p-6 shadow-lg ${color} text-white flex items-center justify-between`}
  >
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
    <div>{icon}</div>
  </motion.div>
);
