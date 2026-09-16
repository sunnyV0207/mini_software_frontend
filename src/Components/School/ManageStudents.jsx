import React, { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaTrash,
  FaEdit,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaIdBadge,
  FaUserFriends,
  FaSchool,
  FaTimes,
  FaEye,
  FaFilter,
  FaVenusMars,
} from "react-icons/fa";
import { RefreshCw, PlusCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const ManageStudents = () => {
  const navigate = useNavigate();
  const { schoolCode } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null); // For Card Modal

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

  // Fetch Students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/students/get-students`
      );
      const studentsArray = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setStudents(studentsArray);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [schoolCode]);

  // Deactivate Student
  const deactivateStudent = (studentId, e) => {
    if (e) e.stopPropagation();

    Swal.fire({
      title: "Deactivate Student",
      text: "Are you sure you want to deactivate this student? You can reactivate them later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deactivate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/student/update-student-status/${studentId}`
          );
          setStudents((prev) =>
            prev.map((student) =>
              student._id === studentId ? { ...student, status: "Inactive" } : student
            )
          );
          if (selectedStudent && selectedStudent._id === studentId) {
            setSelectedStudent((prev) => ({ ...prev, status: "Inactive" }));
          }
          Swal.fire({
            icon: "success",
            title: "Deactivated",
            text: "Student has been deactivated successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deactivating student:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to deactivate student.",
          });
        }
      }
    });
  };

  // Reactivate Student
  const reactivateStudent = (studentId, e) => {
    if (e) e.stopPropagation();

    Swal.fire({
      title: "Activate Student",
      text: "Are you sure you want to activate this student?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Activate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/student/update-student-status/${studentId}`
          );
          setStudents((prev) =>
            prev.map((student) =>
              student._id === studentId ? { ...student, status: "Active" } : student
            )
          );
          if (selectedStudent && selectedStudent._id === studentId) {
            setSelectedStudent((prev) => ({ ...prev, status: "Active" }));
          }
          Swal.fire({
            icon: "success",
            title: "Activated",
            text: "Student has been activated successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error activating student:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to activate student.",
          });
        }
      }
    });
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.phone && s.phone.toLowerCase().includes(term)) ||
      (s.rollNumber && String(s.rollNumber).toLowerCase().includes(term)) ||
      (s.parentName && s.parentName.toLowerCase().includes(term));

    const matchesClass =
      selectedClass === "" ||
      (s.class && String(s.class.classNumber) === String(selectedClass));

    const matchesSection =
      selectedSection === "" ||
      (s.class && s.class.section === selectedSection);

    const matchesGender =
      selectedGender === "All" ||
      (s.gender && s.gender.toLowerCase() === selectedGender.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      (s.status && s.status.toLowerCase() === selectedStatus.toLowerCase());

    return (
      matchesSearch &&
      matchesClass &&
      matchesSection &&
      matchesGender &&
      matchesStatus
    );
  });

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2.5">
            <FaUserGraduate className="text-indigo-600" /> Manage Students
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse enrolled students, filter records, or click any student to view the full profile card.
          </p>
        </div>

        <button
          onClick={() => navigate(`/school/${schoolCode}/students/add`)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto font-medium"
        >
          <PlusCircle size={20} />
          Add Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Search */}
        <div className="sm:col-span-2 md:col-span-2 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
          <FaSearch className="text-gray-400 text-base flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, roll no, email, phone, parent..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {/* Class Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <FaSchool className="text-gray-400 text-xs" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
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
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Gender & Status Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <FaFilter className="text-gray-400 text-xs" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
        <span>
          Showing <strong>{filteredStudents.length}</strong> of{" "}
          <strong>{students.length}</strong> students
        </span>
        {(search || selectedClass || selectedSection || selectedGender !== "All" || selectedStatus !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedClass("");
              setSelectedSection("");
              setSelectedGender("All");
              setSelectedStatus("All");
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Students List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <FaUserGraduate className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-700 text-lg font-medium">No students found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search criteria or enroll a new student.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 sm:px-6">Student</th>
                  <th className="py-3.5 px-4">Class & Sec</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-indigo-50/40 transition cursor-pointer group"
                  >
                    {/* Student */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-105 transition">
                          <FaUserGraduate />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition">
                            {student.name}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                            <FaIdBadge size={10} /> Roll #{student.rollNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Class & Section */}
                    <td className="py-3.5 px-4">
                      {student.class ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200">
                          Class {student.class.classNumber}-{student.class.section}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">N/A</span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="space-y-0.5 text-xs">
                        <p className="flex items-center gap-1.5 text-gray-700 truncate">
                          <FaEnvelope className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{student.email}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-500">
                          <FaPhone className="text-gray-400 flex-shrink-0" />
                          <span>{student.phone || "N/A"}</span>
                        </p>
                      </div>
                    </td>

                    {/* Parent */}
                    <td className="py-3.5 px-4 text-gray-700 text-xs">
                      {student.parentName ? (
                        <div>
                          <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                            <FaUserFriends className="text-indigo-500" /> {student.parentName}
                          </p>
                          {student.parentPhone && (
                            <p className="text-gray-500 pl-4">{student.parentPhone}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          student.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {student.status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="View Student Card"
                        >
                          <FaEye size={15} />
                        </button>

                        <button
                          onClick={() => navigate(`/school/student/${student._id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Student"
                        >
                          <FaEdit size={15} />
                        </button>

                        {student.status === "Active" ? (
                          <button
                            onClick={(e) => deactivateStudent(student._id, e)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Deactivate Student"
                          >
                            <FaTrash size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => reactivateStudent(student._id, e)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Activate Student"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INTERACTIVE STUDENT CARD MODAL */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden p-6 sm:p-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  selectedStudent.status === "Active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {selectedStudent.status || "Active"}
              </span>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Student Avatar & Basic Details */}
            <div className="text-center mt-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-4xl shadow-inner mb-3">
                <FaUserGraduate />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedStudent.name}
              </h2>
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">
                Roll #{selectedStudent.rollNumber || "N/A"} • {selectedStudent.gender || "Student"}
              </p>
            </div>

            {/* Class & Section Info */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-indigo-50/80 p-3 rounded-xl text-center border border-indigo-100">
                <p className="text-xs text-indigo-500 font-medium">Class</p>
                <p className="text-base font-bold text-indigo-900 mt-0.5">
                  {selectedStudent.class?.classNumber ? `Class ${selectedStudent.class.classNumber}` : "N/A"}
                </p>
              </div>
              <div className="bg-purple-50/80 p-3 rounded-xl text-center border border-purple-100">
                <p className="text-xs text-purple-500 font-medium">Section</p>
                <p className="text-base font-bold text-purple-900 mt-0.5">
                  {selectedStudent.class?.section ? `Section ${selectedStudent.class.section}` : "N/A"}
                </p>
              </div>
            </div>

            {/* Contact & Parent Info */}
            <div className="mt-5 space-y-2.5 text-sm text-gray-700 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400 text-base flex-shrink-0" />
                <span className="truncate">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400 text-base flex-shrink-0" />
                <span>{selectedStudent.phone || "No phone provided"}</span>
              </div>
              {selectedStudent.parentName && (
                <div className="flex items-center gap-3">
                  <FaUserFriends className="text-gray-400 text-base flex-shrink-0" />
                  <span>
                    Parent: <strong>{selectedStudent.parentName}</strong>{" "}
                    {selectedStudent.parentPhone && `(${selectedStudent.parentPhone})`}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  navigate(`/school/student/${selectedStudent._id}/edit`);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                <FaEdit size={14} /> Edit Student
              </button>

              {selectedStudent.status === "Active" ? (
                <button
                  onClick={() => deactivateStudent(selectedStudent._id)}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 px-4 rounded-xl font-semibold text-sm transition"
                >
                  <FaTrash size={13} /> Deactivate
                </button>
              ) : (
                <button
                  onClick={() => reactivateStudent(selectedStudent._id)}
                  className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2.5 px-4 rounded-xl font-semibold text-sm transition"
                >
                  <RefreshCw size={14} /> Activate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

