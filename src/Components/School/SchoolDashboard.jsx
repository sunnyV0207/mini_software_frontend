import React, { use, useEffect, useState } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaSchool,
  FaSignOutAlt,
  FaBookOpen,
  FaPlus,
  FaTimes
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'

function SchoolDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [school,setSchool] = useState(null)

  const [stats, setStats] = useState({
    schoolName: "",
    established: "",
    phone: "",
    email: "",
    address: "",
    teachers: 0,
    students: 0,
    parents: 0,
    classes: 0,
    attendance: 0
  });

  const fetchSchololData = async (schoolId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolId}/get-school`);
      const data = response.data.data;
      // console.log(data)
      setSchool(data)
      setStats({
        schoolName: data.schoolName,
        established: new Date(data.established).getFullYear(),
        phone: data.contactNumber,
        email: data.email,
        address: data.address,
        teachers: data.teachers.length,
        students: data.students.length,
        parents: data.parents.length,
        classes: data.classes?.length || 0,
        attendance: 50
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching school data:", error);
      setLoading(false)
      navigate('/login')
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    // console.log(parsedUser);
    if(parsedUser.role !== "Principal"){
      navigate("/login");
      return;
    }
    if(parsedUser.school){
      fetchSchololData(parsedUser.school._id);
    }
  }, []);

  const logout = () => {
    Swal.fire({
      icon: 'question',
      title: 'Logout',
      text: 'Are you sure want to logout',
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4F46E5",  // Indigo
      cancelButtonColor: "#6B7280"    // Gray
    }).then(()=>{
      localStorage.removeItem("user");
      navigate("/login");
    })
  }

  const navItem =
    "flex items-center gap-3 px-5 py-3 text-white text-lg hover:bg-[#3d3dbb] transition";
  const activeNav =
    "flex items-center gap-3 px-5 py-3 bg-[#3d3dbb] text-white text-lg shadow-inner";

  if(loading){
    return (
      <div className="min-h-screen flex flex-row items-center justify-center"><p className="text-3xl font-bold">Loading...</p></div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6ff]">

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#2b2b8f] flex flex-col 
          z-40 transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-5 mt-6">
          <h1 className="text-3xl text-white font-extrabold">EduNexus</h1>

          <button
            className="text-white text-2xl lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-10">
          {[ 
            { to: "/school/dashboard", label: "Dashboard", icon: <FaTachometerAlt size={20} /> },
            { to: "/principal/teachers", label: "Manage Teachers", icon: <FaChalkboardTeacher size={20} /> },
            { to: "/principal/students", label: "Manage Students", icon: <FaUserGraduate size={20} /> },
            { to: "/principal/parents", label: "Manage Parents", icon: <FaUsers size={20} /> },
            { to: "/principal/classes", label: "Manage Classes", icon: <FaSchool size={20} /> },
          ].map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => (isActive ? activeNav : navItem)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto mb-6 px-5">
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-5 py-3 text-lg text-red-300 hover:text-red-400 hover:bg-[#1f1f6e] transition rounded-lg"
          >
            <FaSignOutAlt size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6 md:p-10">

        <button
          className="lg:hidden text-3xl text-[#2b2b8f] mb-6"
          onClick={() => setMobileOpen(true)}
        >
          <FaBars />
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2b2b8f]">
          Welcome, Principal
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Here is an overview of your school and its activity.
        </p>

        {/* SCHOOL DETAILS (Option A) */}
        <div className="bg-white p-6 sm:p-8 mt-6 rounded-2xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2b2b8f] mb-4">
            School Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Name:</span> {stats.schoolName}</p>
            <p><span className="font-semibold">Established:</span> {stats.established}</p>
            <p><span className="font-semibold">Phone:</span> {stats.phone}</p>
            <p><span className="font-semibold">Email:</span> {stats.email}</p>
            <p className="sm:col-span-2">
              <span className="font-semibold">Address:</span> {stats.address}
            </p>
          </div>
        </div>

        {/* STATS CARDS WITH ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          <StatCard
            title="Teachers"
            value={stats.teachers}
            color="bg-[#3b82f6]"
            icon={<FaChalkboardTeacher size={26} />}
            addLabel="Add Teacher"
            onAdd={() => navigate(`/school/${school.schoolCode}/teachers/add`)}
            onClick={() => navigate("/principal/teachers")}
          />

          <StatCard
            title="Students"
            value={stats.students}
            color="bg-[#9333ea]"
            icon={<FaUserGraduate size={26} />}
            addLabel="Add Student"
            onAdd={() => navigate("/principal/students/add")}
            onClick={() => navigate("/principal/students")}
          />

          <StatCard
            title="Parents"
            value={stats.parents}
            color="bg-[#ec4899]"
            icon={<FaUsers size={26} />}
            addLabel="Add Parent"
            onAdd={() => navigate("/principal/parents/add")}
            onClick={() => navigate("/principal/parents")}
          />

          <StatCard
            title="Classes"
            value={stats.classes}
            color="bg-[#0ea5e9]"
            icon={<FaBookOpen size={26} />}
            addLabel="Add Class"
            onAdd={() => navigate(`/school/${school.schoolCode}/classes/add`)}
            onClick={() => navigate("/principal/classes")}
          />
        </div>

        {/* CIRCLE ATTENDANCE GRAPH */}
        <div className="mt-10 flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#2b2b8f] mb-4">Attendance Today</h2>

            <div className="relative w-40 h-40 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#2b2b8f ${stats.attendance}%, #d1d5db ${stats.attendance}%)`,
                }}
              ></div>

              <div className="absolute w-28 h-28 bg-white rounded-full flex items-center justify-center text-[#2b2b8f] text-3xl font-bold">
                {stats.attendance}%
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// ===========================================================
// STAT CARD COMPONENT WITH "ADD" BUTTONS (Option 2)
// ===========================================================
const StatCard = ({ title, value, icon, color, onClick, addLabel, onAdd }) => {
  return (
    <div
      className={`${color} text-white p-6 rounded-2xl shadow cursor-pointer transition hover:shadow-xl`}
    >
      <div onClick={onClick} className="flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">{title}</p>
          <h3 className="text-3xl font-extrabold mt-2">{value}</h3>
        </div>
        {icon}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        className="mt-4 bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-gray-200 transition"
      >
        <FaPlus /> {addLabel}
      </button>
    </div>
  );
};

export { SchoolDashboard };
