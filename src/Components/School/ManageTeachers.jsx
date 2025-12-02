import React, { useEffect, useState } from "react";
import { FaUserTie, FaTrash, FaEdit, FaSearch, FaPlus, } from "react-icons/fa";
import {RefreshCw,PlusCircle} from 'lucide-react'
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom"
import Swal from "sweetalert2"

const ManageTeachers = () => {
  const navigate = useNavigate();
  const {schoolCode} = useParams();
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [message,setMessage] = useState("")

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/teachers/get-teachers`
      );
      // console.log(response.data.data)
      const teachersArray = Array.isArray(response.data.data) ? response.data.data : []
      setTeachers(teachersArray)
    } catch (error) {
      // console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const deactivateTeacher = (teacherId) => {
  
      Swal.fire({
          title: "Deactivate Teacher",
          text: "Are you sure you want to deactivate this teacher? You can reactivate it later.",
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
              `${import.meta.env.VITE_BACKEND_URL}/api/teacher/update-teacher-status/${teacherId}`
            );
            setTeachers((prevTeacher) =>
              prevTeacher.map((teacher) =>
                teacher._id === teacherId ? { ...teacher, status: "Inactive" } : teacher
              )
            );
          } catch (error) {
            console.error("Error deactivating school:", error);
            // setMessage(error.response?.data?.message)
            alert(error.response?.data?.message)
          }
      }
      }); 
    };
  
    const renewTeacher = (teacherId) => {
      Swal.fire({
          title: "Renew Teacher",
          text: "Are you sure you want to renew this teacher?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Renew",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#4F46E5",  // Indigo
          cancelButtonColor: "#6B7280"    // Gray
      }).then((result) => {
      if (result.isConfirmed) {
          try {
            axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/teacher/update-teacher-status/${teacherId}`
              );
              setTeachers((prevTeacher) =>
                prevTeacher.map((teacher) =>
                  teacher._id === teacherId ? { ...teacher, status: "Active" } : teacher
                )
              );
          } catch (error) {
            alert(error.response?.data?.message)
          }
      }
      }); 
    };

  // Filter teachers
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/${id}`
      );
      setTeachers(teachers.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Manage Teachers
      </h1>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white shadow p-3 rounded-xl mb-6">
        <FaSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search teachers..."
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={() => navigate(`/school/${schoolCode}/teachers/add`)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md transition-all mt-4 mb-4 md:mt-0"
        >
          <PlusCircle size={20} />
          Add Teacher
        </button>
      </div>

      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTeachers.length === 0 && (
          <p className="text-gray-600 col-span-full text-center">
            No teachers found.
          </p>
        )}

        {filteredTeachers.map((teacher) => (
          <div
            key={teacher._id}
            className="bg-white rounded-2xl shadow p-5 border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-3xl">
                <FaUserTie />
              </div>

              <div>
                <h3 className="font-bold text-lg">{teacher.name}</h3>
                <p className="text-sm text-gray-600">{teacher.email}</p>
                <p className="text-sm text-gray-600">{teacher.phone}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-100 p-2 rounded text-center text-sm">
                Class: <span className="font-bold">{teacher.class.classNumber}</span>
              </div>
              <div className="bg-gray-100 p-2 rounded text-center text-sm">
                Section:{" "}
                <span className="font-bold">{teacher.class.section}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => navigate(`/school/teacher/${teacher._id}/edit`)}
              >
                <FaEdit /> Edit
              </button>

              {
                teacher.status === "Active" ?
                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={() => deactivateTeacher(teacher._id)}
                >
                  <FaTrash /> Deactivate
                </button> :
                <button
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => renewTeacher(teacher._id)}
                >
                  <RefreshCw /> Activate
                </button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export {ManageTeachers};
