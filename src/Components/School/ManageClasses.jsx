import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUserTie,
  FaUserGraduate,
  FaEdit,
  FaSchool,
  FaBook,
  FaTimes,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const ManageClasses = () => {
  const navigate = useNavigate();
  const { schoolCode } = useParams();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("All");
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCls, setSelectedCls] = useState(null); // For Card Modal

  const classList = Array.from({ length: 12 }, (_, i) => i + 1);
  const sectionList = ["A", "B", "C", "D"];

  const fetchClasses = async (schoolCode) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/classes/fetch-all`
      );
      const data = res.data.data;
      setClassesData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(schoolCode);
  }, [schoolCode]);

  // Filter classes
  const filteredClasses = classesData.filter((cls) => {
    const term = search.toLowerCase();
    const classNameStr = `Class ${cls.classNumber}${cls.section}`.toLowerCase();
    const teacherName = cls.classTeacher?.name ? cls.classTeacher.name.toLowerCase() : "";
    const subjectsStr = Array.isArray(cls.subjects) ? cls.subjects.join(" ").toLowerCase() : "";

    const matchesSearch =
      classNameStr.includes(term) ||
      teacherName.includes(term) ||
      subjectsStr.includes(term);

    const matchesClass =
      selectedClass === "" || String(cls.classNumber) === String(selectedClass);

    const matchesSection =
      selectedSection === "" || cls.section === selectedSection;

    const matchesTeacher =
      teacherFilter === "All" ||
      (teacherFilter === "Assigned" && cls.classTeacher) ||
      (teacherFilter === "Unassigned" && !cls.classTeacher);

    return matchesSearch && matchesClass && matchesSection && matchesTeacher;
  });

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2.5">
            <FaSchool className="text-indigo-600" /> Manage Classes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of academic classes, subjects curriculum, and student breakdown.
          </p>
        </div>

        <button
          onClick={() => navigate(`/school/${schoolCode}/classes/add`)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto font-medium"
        >
          <FaPlus /> Add New Class
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Search */}
        <div className="sm:col-span-2 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
          <FaSearch className="text-gray-400 text-base flex-shrink-0" />
          <input
            type="text"
            placeholder="Search class number, section, teacher, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Class Grade Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <FaSchool className="text-gray-400 text-xs" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
          >
            <option value="">All Classes</option>
            {classList.map((num) => (
              <option key={num} value={num}>
                Class {num}
              </option>
            ))}
          </select>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
          >
            <option value="">All Sections</option>
            {sectionList.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
        <span>
          Showing <strong>{filteredClasses.length}</strong> of{" "}
          <strong>{classesData.length}</strong> classes
        </span>
        {(search || selectedClass || selectedSection || teacherFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedClass("");
              setSelectedSection("");
              setTeacherFilter("All");
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Classes List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <FaSchool className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-700 text-lg font-medium">No classes found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search filters or click "Add New Class" above.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 sm:px-6">Class & Section</th>
                  <th className="py-3.5 px-4">Class Teacher</th>
                  <th className="py-3.5 px-4">Students (Boys / Girls)</th>
                  <th className="py-3.5 px-4">Curriculum Subjects</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredClasses.map((cls) => (
                  <tr
                    key={cls._id}
                    onClick={() => setSelectedCls(cls)}
                    className="hover:bg-indigo-50/40 transition cursor-pointer group"
                  >
                    {/* Class & Section */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-105 transition">
                          <FaSchool />
                        </div>
                        <div>
                          <p className="font-bold text-indigo-700 text-base group-hover:text-indigo-900 transition">
                            CLASS {cls.classNumber}{cls.section}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total Students: {cls.students?.length || cls.totalStudents || 0}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Class Teacher */}
                    <td className="py-3.5 px-4">
                      {cls.classTeacher?.name ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                          <FaUserTie className="text-green-600 flex-shrink-0" />
                          <span>{cls.classTeacher.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>

                    {/* Students Breakdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-blue-600">
                          <FaUserGraduate /> {cls.boys ?? 0} Boys
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-pink-600">
                          <FaUserGraduate /> {cls.girls ?? 0} Girls
                        </span>
                      </div>
                    </td>

                    {/* Curriculum Subjects */}
                    <td className="py-3.5 px-4">
                      {Array.isArray(cls.subjects) && cls.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1 items-center">
                          {cls.subjects.slice(0, 3).map((sub, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold text-[11px] rounded-md border border-indigo-200"
                            >
                              {sub}
                            </span>
                          ))}
                          {cls.subjects.length > 3 && (
                            <span className="text-[11px] text-gray-500 font-medium">
                              +{cls.subjects.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No Subjects</span>
                      )}
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        {cls.attendance || 85}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCls(cls)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="View Class Card"
                        >
                          <FaEye size={15} />
                        </button>

                        <button
                          onClick={() => navigate(`/school/class/${cls._id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Class"
                        >
                          <FaEdit size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INTERACTIVE CLASS CARD MODAL */}
      {selectedCls && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedCls(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden p-6 sm:p-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-indigo-700">
                  CLASS {selectedCls.classNumber}{selectedCls.section}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Academic Class Overview</p>
              </div>

              <button
                onClick={() => setSelectedCls(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-indigo-50/80 p-3.5 rounded-xl text-center border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium">Total Students</p>
                <p className="text-xl font-bold text-indigo-900 mt-0.5">
                  {selectedCls.students?.length || selectedCls.totalStudents || 0}
                </p>
              </div>

              <div className="bg-blue-50/80 p-3.5 rounded-xl text-center border border-blue-100">
                <p className="text-xs text-blue-600 font-medium flex items-center justify-center gap-1">
                  <FaUserGraduate /> Boys
                </p>
                <p className="text-xl font-bold text-blue-900 mt-0.5">
                  {selectedCls.boys ?? 0}
                </p>
              </div>

              <div className="bg-pink-50/80 p-3.5 rounded-xl text-center border border-pink-100">
                <p className="text-xs text-pink-600 font-medium flex items-center justify-center gap-1">
                  <FaUserGraduate /> Girls
                </p>
                <p className="text-xl font-bold text-pink-900 mt-0.5">
                  {selectedCls.girls ?? 0}
                </p>
              </div>
            </div>

            {/* Teacher & Attendance Info */}
            <div className="mt-5 space-y-2.5 text-sm text-gray-700 border-t border-gray-100 pt-4">
              <p className="flex items-center gap-2">
                <FaUserTie className="text-green-600 flex-shrink-0" />
                <span>
                  <strong>Teacher Assigned:</strong>{" "}
                  {selectedCls.classTeacher?.name || "Not Assigned"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <FaSchool className="text-indigo-600 flex-shrink-0" />
                <span>
                  <strong>Today Attendance:</strong> {selectedCls.attendance || 85}%
                </span>
              </p>
            </div>

            {/* Subject Badges */}
            <div className="mt-5 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-900 mb-2.5 flex items-center gap-1.5">
                <FaBook className="text-indigo-600" />
                Curriculum Subjects ({selectedCls.subjects?.length || 0}):
              </p>

              {Array.isArray(selectedCls.subjects) && selectedCls.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCls.subjects.map((subj, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-600 text-white font-medium text-xs rounded-lg shadow-sm"
                    >
                      {subj}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No subjects configured for this class.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedCls(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedCls(null);
                  navigate(`/school/class/${selectedCls._id}/edit`);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                <FaEdit size={14} /> Edit Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

