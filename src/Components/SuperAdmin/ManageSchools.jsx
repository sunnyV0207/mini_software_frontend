import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Eye,
  RefreshCw,
  Ban,
  School as SchoolIcon,
  User
} from "lucide-react";
import {useNavigate} from 'react-router-dom';
import Swal from "sweetalert2"; 

const ManageSchools = () => {
    const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/school/fetch-schools`
        );

        const schoolArray = Array.isArray(res.data.data.schools)
          ? res.data.data.schools
          : [];

        setSchools(schoolArray);
        setFilteredSchools(schoolArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const filtered = schools.filter((school) =>
      school.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchQuery, schools]);

  const deactivateSchool = (schoolId) => {

    Swal.fire({
        title: "Deactivate School",
        text: "Are you sure you want to deactivate this school? You can reactivate it later.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Deactivate",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#4F46E5",  // Indigo
        cancelButtonColor: "#6B7280"    // Gray
    }).then(async(result) => {
    if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/update-school-status/${schoolId}`
          );
          setSchools((prevSchools) =>
            prevSchools.map((school) =>
              school._id === schoolId ? { ...school, status: "Inactive" } : school
            )
          );
        } catch (error) {
          console.error("Error deactivating school:", error);
        }
    }
    }); 
  };

  const renewSchool = (schoolId) => {
    Swal.fire({
        title: "Renew School",
        text: "Are you sure you want to renew this school?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Renew",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#4F46E5",  // Indigo
        cancelButtonColor: "#6B7280"    // Gray
    }).then(async (result) => {
    if (result.isConfirmed) {
        axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/update-school-status/${schoolId}`
          );
          setSchools((prevSchools) =>
            prevSchools.map((school) =>
              school._id === schoolId ? { ...school, status: "Active" } : school
            )
          );
    }
    }); 
  };

  return (
    <div className="p-4 sm:p-6 animate-fadeIn">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
          Manage Schools
        </h1>

        <button
          onClick={() => (navigate('/super-admin/add-school'))}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-xl shadow-md transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add School
        </button>
      </div>

      <div className="mb-6 w-full">
        <div className="flex items-center w-full gap-3 bg-gray-50 border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-sm focus-within:border-indigo-500 transition-all">
          <Search size={20} className="text-indigo-600" />
          <input
            type="text"
            placeholder="Search school by name..."
            className="w-full bg-transparent outline-none text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
          Loading schools…
        </div>
      )}

      {!loading && filteredSchools.length === 0 && (
        <div className="text-center py-10 text-gray-600 bg-gray-100 rounded-xl text-sm sm:text-base">
          No schools found.
        </div>
      )}

      <div className="space-y-4">
        {filteredSchools.map((school) => (
          <div
            key={school._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4"
          >
            <div className="w-full" onClick={()=>navigate(`/super-admin/school/${school.schoolCode}`)}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <SchoolIcon size={20} className="text-indigo-600" />
                {school.schoolName}
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                School Code: <span className="font-medium">{school.schoolCode}</span>
              </p>

              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                <User size={16} className="text-indigo-600" />
                Principal: {" "}
                <span className="font-medium">
                  {school.principal ? school.principal.name : "Not Assigned"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button onClick={()=>navigate(`/super-admin/school/${school.schoolCode}`)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all w-full sm:w-auto justify-center text-sm">
                <Eye size={18} />
                View
              </button>

              {
                school.status === "Active" ? 
                (
                  <button onClick={()=>deactivateSchool(school._id)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all w-full sm:w-auto justify-center text-sm">
                    <Ban size={18} />
                    Deactivate
                  </button>
                ) :
                (
                  <button onClick={()=>renewSchool(school._id)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all w-full sm:w-auto justify-center text-sm">
                    <RefreshCw size={18} />
                    Renew
                  </button>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export {ManageSchools};