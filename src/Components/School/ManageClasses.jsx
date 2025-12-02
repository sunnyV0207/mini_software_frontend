import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { useNavigate,useParams } from "react-router-dom";
import axios from 'axios'

export const ManageClasses = ()=> {
  const navigate = useNavigate();
  const {schoolCode} = useParams()

  const [search, setSearch] = useState("");
  const [classesData, setClassesData] = useState([]);
  const [loading,setLoading] = useState(true)

  // Filter classes
  const filteredClasses = classesData.filter((cls) =>
    cls.classNumber.toString().toLowerCase().includes(search.toLowerCase())
  );

  const fetchClasses = async(schoolCode) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/classes/fetch-all`)
      const data = res.data.data
      setClassesData(data)
      // console.log(data)
    } catch (error) {
      // console.log(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchClasses(schoolCode)
  },[])

  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    )
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 sm:mb-0">
          Manage Classes
        </h1>

        <button
          onClick={() => navigate(`/school/${schoolCode}/classes/add`)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <FaPlus /> Add New Class
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex justify-center">
        <div className="w-full sm:w-96 relative">
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search Class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {
        filteredClasses.length > 0 ? 
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {filteredClasses.map((cls, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              CLASS {cls.classNumber}{cls.section}
            </h2>

            <p className="text-gray-700">
              <strong>Total Students:</strong> {cls.students.length}
            </p>

            <p className="text-gray-700 flex items-center gap-2 mt-1">
              <FaUserGraduate className="text-blue-600" />
              <strong>Boys:</strong> {cls.boys}
            </p>

            <p className="text-gray-700 flex items-center gap-2 mt-1">
              <FaUserGraduate className="text-pink-600" />
              <strong>Girls:</strong> {cls.girls}
            </p>

            <p className="text-gray-700 flex items-center gap-2 mt-3">
              <FaUserTie className="text-green-600" />
              <strong>Teacher Assign:</strong> {cls.classTeacher.name}
            </p>

            <p className="text-gray-700 mt-3">
              <strong>Today Attendance:</strong> {cls.attendance}%
            </p>
          </div>
        ))}
      </div> : 
      <div className="w-full flex flex-row justify-center mt-8">
        <p>No class Found</p>
      </div>
      }
    </div>
  );
}
