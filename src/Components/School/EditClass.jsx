import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaBook, FaSchool, FaUserTie } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const EditClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classNumber, setClassNumber] = useState("");
  const [section, setSection] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [classTeacher, setClassTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [schoolCode, setSchoolCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Class Details
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/school/class/${classId}`
        );
        const classData = res.data?.data;

        setClassNumber(classData.classNumber || "");
        setSection(classData.section || "");
        setSubjects(Array.isArray(classData.subjects) ? classData.subjects : []);
        setClassTeacher(classData.classTeacher?._id || classData.classTeacher || "");

        const code = classData.school?.schoolCode || "";
        setSchoolCode(code);

        // Fetch teachers of this school
        if (code) {
          const teacherRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/${code}/teachers/get-teachers`
          );
          setTeachers(Array.isArray(teacherRes.data?.data) ? teacherRes.data.data : []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching class details:", err);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to load class details.",
        }).then(() => navigate(-1));
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed !== "" && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subjectToRemove) => {
    setSubjects(subjects.filter((sub) => sub !== subjectToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subjects.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Subjects Required",
        text: "Please add at least one subject to this class.",
      });
      return;
    }

    setSaving(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/class/${classId}/edit`,
        {
          classNumber,
          section,
          subjects,
          classTeacher: classTeacher || null,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Class details and subjects updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(schoolCode ? `/school/${schoolCode}/classes` : "/school");
    } catch (err) {
      console.error("Error updating class:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update class.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading class details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
              Edit Class {classNumber} - {section}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Add, remove, or modify class curriculum subjects and assign class teachers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CLASS NUMBER */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Class Number</label>
            <select
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              required
            >
              <option value="">Select Class</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Class {num}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
              required
            >
              <option value="">Select Section</option>
              {["A", "B", "C", "D"].map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          {/* ASSIGNED CLASS TEACHER */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold flex items-center gap-2">
              <FaUserTie className="text-indigo-600" /> Class Teacher (Optional)
            </label>
            <select
              value={classTeacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
            >
              <option value="">No Class Teacher Assigned</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT INPUT & MANAGEMENT */}
          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
            <label className="block text-indigo-900 mb-2 font-bold flex items-center gap-2">
              <FaBook className="text-indigo-600" /> Manage Subjects (Add / Remove)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Type a subject name and click "Add Subject" or press Enter. Click the (x) on any badge to remove it.
            </p>

            <div className="flex gap-2.5">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Mathematics, Physics, English"
                className="flex-1 border border-gray-300 bg-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm transition"
              />
              <button
                type="button"
                onClick={addSubject}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-semibold shadow transition flex-shrink-0"
              >
                <FaPlus size={14} /> Add Subject
              </button>
            </div>

            {/* SUBJECT LIST BADGES */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {subjects.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No subjects added yet.</p>
              ) : (
                subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2.5 shadow-sm transition hover:bg-indigo-700"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="text-indigo-200 hover:text-white transition p-0.5 rounded-full hover:bg-white/20 focus:outline-none"
                      title={`Remove ${subject}`}
                    >
                      <FaTimes size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
