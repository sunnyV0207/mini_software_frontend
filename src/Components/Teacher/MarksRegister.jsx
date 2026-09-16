import React, { useEffect, useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaAward,
  FaCheckCircle,
  FaClipboardList,
  FaDownload,
  FaExclamationCircle,
  FaEye,
  FaFileAlt,
  FaFilter,
  FaGraduationCap,
  FaInfoCircle,
  FaLock,
  FaPenNib,
  FaPrint,
  FaSave,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { FinalMarksheetModal } from "./FinalMarksheetModal.jsx";

const EXAM_SERIES = [
  { key: "FA-I", label: "FA-I", title: "Formative Assessment I", maxMarks: 25, badgeColor: "bg-amber-100 text-amber-900 border-amber-300" },
  { key: "FA-II", label: "FA-II", title: "Formative Assessment II", maxMarks: 25, badgeColor: "bg-amber-100 text-amber-900 border-amber-300" },
  { key: "SA-I", label: "SA-I", title: "Summative Assessment I (Term 1)", maxMarks: 60, badgeColor: "bg-blue-100 text-blue-900 border-blue-300" },
  { key: "FA-III", label: "FA-III", title: "Formative Assessment III", maxMarks: 25, badgeColor: "bg-amber-100 text-amber-900 border-amber-300" },
  { key: "FA-IV", label: "FA-IV", title: "Formative Assessment IV", maxMarks: 25, badgeColor: "bg-amber-100 text-amber-900 border-amber-300" },
  { key: "SA-II", label: "SA-II", title: "Summative Assessment II (Annual)", maxMarks: 60, badgeColor: "bg-purple-100 text-purple-900 border-purple-300" },
];

export const MarksRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [selectedExam, setSelectedExam] = useState("FA-I"); // "FA-I", ..., "SA-II", "CUMULATIVE"
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const [hasClass, setHasClass] = useState(true);
  const [classData, setClassData] = useState(null);
  const [teacher, setTeacher] = useState(null);

  // Active Exam Sheet Data
  const [marksSheet, setMarksSheet] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Cumulative Sheet Data
  const [cumulativeData, setCumulativeData] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
  const [marksheetModalOpen, setMarksheetModalOpen] = useState(false);
  const [selectedStudentIdForMarksheet, setSelectedStudentIdForMarksheet] = useState(null);

  const openMarksheetModal = (sId) => {
    setSelectedStudentIdForMarksheet(sId);
    setMarksheetModalOpen(true);
  };

  // Fetch standard single-exam marks sheet
  const fetchMarksSheet = async (teacherId, examType) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/marks/${teacherId}/sheet?examType=${examType}&year=${academicYear}`
      );
      const data = res.data?.data;

      if (!data?.hasClass) {
        setHasClass(false);
      } else {
        setHasClass(true);
        setClassData(data.classData);
        setMarksSheet(data.marksSheet);
        setExamDetails(data.examDetails);
        setAnalytics(data.analytics);
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error fetching marks sheet:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to load marks sheet.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cumulative session sheet (all 6 exams)
  const fetchCumulativeSheet = async (teacherId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/marks/${teacherId}/cumulative?year=${academicYear}`
      );
      const data = res.data?.data;

      if (!data?.hasClass) {
        setHasClass(false);
      } else {
        setHasClass(true);
        setClassData(data.classData);
        setCumulativeData(data);
      }
    } catch (err) {
      console.error("Error fetching cumulative sheet:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to load cumulative ledger.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userStr);
    if (parsedUser.role !== "Teacher") {
      navigate("/login");
      return;
    }
    setTeacher(parsedUser);

    if (selectedExam === "CUMULATIVE") {
      fetchCumulativeSheet(parsedUser._id);
    } else {
      fetchMarksSheet(parsedUser._id, selectedExam);
    }
  }, [selectedExam, academicYear, navigate]);

  // Handle Mark Input Change
  const handleMarkChange = (studentIndex, subjectName, value) => {
    if (!marksSheet || marksSheet.status === "Locked") return;

    const maxM = examDetails?.maxMarks || 25;
    const updatedRecords = [...marksSheet.records];
    const targetStudent = updatedRecords[studentIndex];
    if (!targetStudent) return;

    const subObj = targetStudent.subjectMarks.find((s) => s.subjectName === subjectName);
    if (!subObj) return;

    if (value === "" || value === null) {
      subObj.marksObtained = null;
      subObj.isAbsent = false;
    } else {
      const num = Number(value);
      if (isNaN(num)) return;
      subObj.marksObtained = Math.min(maxM, Math.max(0, num));
      subObj.isAbsent = false;
    }

    // Live update student totals and grades
    targetStudent.summary = computeStudentLiveSummary(targetStudent.subjectMarks);

    setMarksSheet((prev) => ({
      ...prev,
      records: updatedRecords,
    }));
    setHasChanges(true);
  };

  // Toggle Absent (AB)
  const handleToggleAbsent = (studentIndex, subjectName) => {
    if (!marksSheet || marksSheet.status === "Locked") return;

    const updatedRecords = [...marksSheet.records];
    const targetStudent = updatedRecords[studentIndex];
    if (!targetStudent) return;

    const subObj = targetStudent.subjectMarks.find((s) => s.subjectName === subjectName);
    if (!subObj) return;

    subObj.isAbsent = !subObj.isAbsent;
    if (subObj.isAbsent) {
      subObj.marksObtained = null;
    }

    targetStudent.summary = computeStudentLiveSummary(targetStudent.subjectMarks);

    setMarksSheet((prev) => ({
      ...prev,
      records: updatedRecords,
    }));
    setHasChanges(true);
  };

  // Helper for live student summary calculation
  const computeStudentLiveSummary = (subjectMarksList) => {
    let totalObtained = 0;
    let totalMax = 0;
    let hasAnyMarks = false;
    let failedSubjectsCount = 0;

    subjectMarksList.forEach((sub) => {
      totalMax += sub.maxMarks || 25;
      if (sub.isAbsent) {
        sub.grade = "AB";
        failedSubjectsCount++;
      } else if (sub.marksObtained !== null && sub.marksObtained !== undefined) {
        hasAnyMarks = true;
        const marks = Number(sub.marksObtained);
        totalObtained += marks;
        const subPct = sub.maxMarks > 0 ? (marks / sub.maxMarks) * 100 : 0;
        sub.grade = getGradeLabel(subPct);
        if (subPct < 33) failedSubjectsCount++;
      } else {
        sub.grade = "-";
      }
    });

    const percentage =
      totalMax > 0 && hasAnyMarks ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
    const overallGrade = hasAnyMarks ? getGradeLabel(percentage) : "-";

    let result = "Pending";
    if (hasAnyMarks) {
      result = failedSubjectsCount === 0 && percentage >= 33 ? "Pass" : "Needs Improvement";
    }

    return {
      totalMarksObtained: totalObtained,
      totalMaxMarks: totalMax,
      percentage,
      overallGrade,
      result,
      rank: 0,
    };
  };

  const getGradeLabel = (pct) => {
    if (pct >= 91) return "A1";
    if (pct >= 81) return "A2";
    if (pct >= 71) return "B1";
    if (pct >= 61) return "B2";
    if (pct >= 51) return "C1";
    if (pct >= 41) return "C2";
    if (pct >= 33) return "D";
    return "E";
  };

  // Save Draft Marks
  const handleSaveDraft = async () => {
    if (!teacher || !marksSheet) return;

    try {
      setSaving(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/marks/${teacher._id}/save`, {
        examType: selectedExam,
        academicYear,
        records: marksSheet.records,
        notes: marksSheet.notes,
      });

      setHasChanges(false);
      Swal.fire({
        icon: "success",
        title: "Marks Saved",
        text: `Draft marks for ${selectedExam} successfully saved to database.`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh analytics
      fetchMarksSheet(teacher._id, selectedExam);
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save marks.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Publish & Lock Exam Marks
  const handlePublishResults = async () => {
    if (!teacher || !marksSheet) return;

    const result = await Swal.fire({
      title: `Publish & Lock ${examDetails?.examTitle || selectedExam}?`,
      text: "Publishing will finalize student ranks, generate report cards, and lock the marks entry ledger.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish Results",
      cancelButtonText: "Keep as Draft",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      try {
        setSaving(true);
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/marks/${teacher._id}/publish`, {
          examType: selectedExam,
          academicYear,
        });

        Swal.fire({
          icon: "success",
          title: "Results Published!",
          text: `Official results for ${selectedExam} are now published.`,
          confirmButtonColor: "#4F46E5",
        });

        fetchMarksSheet(teacher._id, selectedExam);
      } catch (err) {
        console.error("Publish error:", err);
        Swal.fire({
          icon: "error",
          title: "Publish Failed",
          text: err.response?.data?.message || "Could not publish results.",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  // Filtered student records
  const filteredRecords = useMemo(() => {
    const list = marksSheet?.records || [];
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter(
      (r) =>
        r.studentName.toLowerCase().includes(term) ||
        String(r.rollNumber).toLowerCase().includes(term)
    );
  }, [marksSheet, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold text-lg animate-pulse">
          Loading Examination & Marks Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex flex-col">
      {/* ===================== TOP NAVIGATION BAR ===================== */}
      <header className="bg-[#2b2b8f] text-white shadow-lg sticky top-0 z-40 border-b border-indigo-900/40 print:hidden">
        <div className="max-w-[98%] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: Brand & Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition border border-white/10 cursor-pointer"
            >
              <FaArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                E
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">
                  EduNexus Marks
                </h1>
                <p className="text-[11px] text-indigo-200 font-medium">
                  Classroom Evaluation & Assessment Ledger
                </p>
              </div>
            </div>
          </div>

          {/* Right: Teacher Badge & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                {teacher?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[130px]">
                  {teacher?.name}
                </p>
                <p className="text-[10px] text-indigo-200 truncate max-w-[130px]">
                  {classData ? `Class ${classData.classNumber}-${classData.section}` : "Teacher"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-red-500/30 cursor-pointer"
            >
              <FaSignOutAlt size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MAIN MARKS WORKSPACE ===================== */}
      <main className="flex-1 max-w-[98%] w-full mx-auto px-2 sm:px-4 py-6 space-y-6">
        {!hasClass ? (
          /* EMPTY STATE: NO CLASS */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-xl mx-auto mt-12"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-4xl mb-4 border border-amber-200">
              <FaExclamationCircle />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              No Primary Classroom Assigned
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              You are currently not assigned as a Class Teacher. Please contact your Principal to assign you to a classroom.
            </p>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="mt-6 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              Back to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* ===================== EXAM SERIES SWITCHER RIBBON ===================== */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4 print:hidden"
            >
              {/* Left: Class & Academic Year */}
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-gray-900">
                    Class {classData?.classNumber}-{classData?.section} Marks Ledger
                  </h2>
                  <span className="px-3 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
                    Session {academicYear}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {classData?.school?.schoolName || teacher?.school?.schoolName} • Standard 6-Assessment Evaluation System
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedExam !== "CUMULATIVE" && marksSheet?.status !== "Locked" && (
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer ${
                      hasChanges
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <FaSave size={13} />
                    <span>{saving ? "Saving..." : hasChanges ? "Save Changes *" : "Draft Saved"}</span>
                  </button>
                )}

                {selectedExam !== "CUMULATIVE" && marksSheet?.status !== "Published" && (
                  <button
                    onClick={handlePublishResults}
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    <FaCheckCircle size={14} />
                    <span>Publish Results</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition cursor-pointer"
                >
                  <FaPrint size={13} />
                  <span>Print Ledger</span>
                </button>
              </div>
            </motion.div>

            {/* Assessment Selector Tabs Bar */}
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              {EXAM_SERIES.map((exam) => {
                const isSelected = selectedExam === exam.key;
                return (
                  <button
                    key={exam.key}
                    onClick={() => setSelectedExam(exam.key)}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20 -translate-y-0.5"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-indigo-200 shadow-xs"
                    }`}
                  >
                    <span>{exam.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : exam.maxMarks === 60
                          ? "bg-blue-50 text-blue-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {exam.maxMarks}M
                    </span>
                  </button>
                );
              })}

              {/* Cumulative Master Ledger Tab */}
              <button
                onClick={() => setSelectedExam("CUMULATIVE")}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  selectedExam === "CUMULATIVE"
                    ? "bg-purple-700 text-white border-purple-700 shadow-md ring-2 ring-purple-500/20 -translate-y-0.5"
                    : "bg-white text-purple-900 border-purple-200 hover:bg-purple-50/50 shadow-xs"
                }`}
              >
                <FaAward size={14} />
                <span>📊 Annual Cumulative Master Sheet (220M)</span>
              </button>
            </div>

            {/* ===================== SUMMARY TILES (SINGLE EXAM MODE) ===================== */}
            {selectedExam !== "CUMULATIVE" && analytics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:hidden">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                    <FaUserGraduate />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">Class Evaluated</p>
                    <h4 className="text-xl font-black text-gray-900">
                      {analytics.evaluatedStudents} / {analytics.totalStudents}
                    </h4>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                    <FaClipboardList />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">Class Average</p>
                    <h4 className="text-xl font-black text-blue-600">{analytics.classAverage}%</h4>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">Pass Rate</p>
                    <h4 className="text-xl font-black text-emerald-600">
                      {analytics.passPercentage}%
                    </h4>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                    <FaAward />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">Class Topper</p>
                    <h4 className="text-sm font-black text-gray-900 truncate max-w-[130px]" title={analytics.topperName}>
                      {analytics.topperName} ({analytics.topperPercentage}%)
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== SPREADSHEET MARKS SHEET (SINGLE EXAM MODE) ===================== */}
            {selectedExam !== "CUMULATIVE" ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header Controls Bar */}
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                      <FaPenNib className="text-indigo-600" />
                      <span>{examDetails?.examTitle || selectedExam} Entry Sheet</span>
                    </h3>
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-xs rounded-md">
                      Max: {examDetails?.maxMarks} Marks / Subject
                    </span>
                  </div>

                  {/* Search Box */}
                  <div className="relative min-w-[220px]">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search student or roll no..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Spreadsheet Table */}
                <div className="overflow-x-auto max-h-[70vh]">
                  <table className="w-full text-center border-collapse border border-gray-200 text-xs">
                    <thead className="sticky top-0 bg-slate-100 z-30 shadow-sm">
                      <tr className="border-b border-gray-300 text-gray-700 text-[11px] font-bold">
                        <th className="sticky left-0 bg-slate-100 z-40 py-2.5 px-3 min-w-[50px] border-r border-gray-300">
                          Roll
                        </th>
                        <th className="sticky left-[50px] bg-slate-100 z-40 py-2.5 px-4 min-w-[170px] text-left border-r border-gray-300">
                          Student Name
                        </th>
                        <th className="py-2.5 px-2 min-w-[45px] border-r border-gray-300">
                          Gen
                        </th>

                        {/* Subject Columns */}
                        {classData?.subjects?.map((subName) => (
                          <th
                            key={subName}
                            className="py-2 px-3 min-w-[110px] border-r border-gray-200 text-center"
                          >
                            <div className="font-extrabold text-gray-900 text-xs">{subName}</div>
                            <div className="text-[10px] font-bold text-indigo-600">
                              (Max: {examDetails?.maxMarks || 25})
                            </div>
                          </th>
                        ))}

                        {/* Summary Columns */}
                        <th className="py-2 px-3 min-w-[75px] bg-blue-50 text-blue-900 border-l-2 border-r border-blue-200">
                          Total
                        </th>
                        <th className="py-2 px-3 min-w-[65px] bg-indigo-50 text-indigo-900 border-r border-indigo-200">
                          % Score
                        </th>
                        <th className="py-2 px-3 min-w-[55px] bg-emerald-50 text-emerald-900 border-r border-emerald-200">
                          Grade
                        </th>
                        <th className="py-2 px-3 min-w-[70px] bg-slate-100 text-gray-900 border-r border-gray-200">
                          Result
                        </th>
                        <th className="py-2 px-3 min-w-[55px] bg-amber-50 text-amber-900 border-r border-amber-200">
                          Rank
                        </th>
                        <th className="py-2 px-3 min-w-[85px] bg-indigo-50 text-indigo-900 border-l border-indigo-200 print:hidden">
                          <span className="flex items-center justify-center gap-1">
                            <FaGraduationCap size={13} />
                            <span>Marksheet</span>
                          </span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={(classData?.subjects?.length || 5) + 8}
                            className="py-12 text-center text-gray-400"
                          >
                            No student records found.
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((stRec, stIdx) => {
                          const summary = stRec.summary || {};
                          const maxMarksAllowed = examDetails?.maxMarks || 25;

                          return (
                            <tr
                              key={stRec.student || stIdx}
                              className="hover:bg-indigo-50/30 transition group"
                            >
                              {/* Roll Number */}
                              <td className="sticky left-0 bg-white group-hover:bg-slate-50 z-20 py-2.5 px-3 font-bold font-mono text-gray-900 border-r border-gray-300">
                                #{stRec.rollNumber || stIdx + 1}
                              </td>

                              {/* Student Name */}
                              <td className="sticky left-[50px] bg-white group-hover:bg-slate-50 z-20 py-2.5 px-4 text-left font-bold text-gray-900 border-r border-gray-300 truncate max-w-[170px]">
                                {stRec.studentName}
                              </td>

                              {/* Gender */}
                              <td className="py-2.5 px-1 border-r border-gray-200 text-gray-500 font-semibold text-[11px]">
                                {stRec.gender === "Female" ? "F" : "M"}
                              </td>

                              {/* Dynamic Subject Marks Inputs */}
                              {classData?.subjects?.map((subName) => {
                                const subMark = stRec.subjectMarks?.find(
                                  (s) => s.subjectName === subName
                                );
                                const isAb = subMark?.isAbsent;
                                const marksVal =
                                  subMark?.marksObtained !== null && subMark?.marksObtained !== undefined
                                    ? subMark.marksObtained
                                    : "";

                                return (
                                  <td
                                    key={subName}
                                    className="p-1.5 border-r border-gray-200 text-center"
                                  >
                                    <div className="flex items-center justify-center gap-1.5">
                                      {isAb ? (
                                        <span className="w-14 py-1 bg-rose-100 text-rose-800 font-black rounded-lg border border-rose-300 text-xs inline-block">
                                          AB
                                        </span>
                                      ) : (
                                        <input
                                          type="number"
                                          min={0}
                                          max={maxMarksAllowed}
                                          placeholder="-"
                                          value={marksVal}
                                          onChange={(e) =>
                                            handleMarkChange(stIdx, subName, e.target.value)
                                          }
                                          className={`w-14 py-1 text-center font-bold text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                            marksVal !== "" && Number(marksVal) < (maxMarksAllowed * 0.33)
                                              ? "bg-rose-50 border-rose-300 text-rose-700"
                                              : marksVal !== ""
                                              ? "bg-emerald-50/70 border-emerald-300 text-emerald-800"
                                              : "bg-white border-gray-200 text-gray-900"
                                          }`}
                                        />
                                      )}

                                      {/* Absent Toggle Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleToggleAbsent(stIdx, subName)}
                                        className={`px-1.5 py-1 text-[10px] font-black rounded-md transition cursor-pointer print:hidden ${
                                          isAb
                                            ? "bg-rose-600 text-white"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                                        }`}
                                        title="Toggle Absent"
                                      >
                                        AB
                                      </button>
                                    </div>

                                    {/* Grade Pill under mark */}
                                    {subMark?.grade && subMark.grade !== "-" && (
                                      <span className="text-[10px] font-extrabold text-gray-400 block mt-0.5">
                                        Gr: {subMark.grade}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}

                              {/* Total Marks */}
                              <td className="py-2.5 px-3 bg-blue-50/60 font-black text-blue-900 border-l-2 border-r border-blue-200 text-xs">
                                {summary.totalMarksObtained || 0} / {summary.totalMaxMarks || 0}
                              </td>

                              {/* Percentage */}
                              <td className="py-2.5 px-3 bg-indigo-50/60 font-extrabold text-indigo-700 border-r border-indigo-200 text-xs">
                                {summary.percentage || 0}%
                              </td>

                              {/* Grade */}
                              <td className="py-2.5 px-3 bg-emerald-50/60 font-black text-emerald-800 border-r border-emerald-200">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-xs">
                                  {summary.overallGrade || "-"}
                                </span>
                              </td>

                              {/* Result Badge */}
                              <td className="py-2.5 px-2 border-r border-gray-200">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    summary.result === "Pass"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : summary.result === "Needs Improvement"
                                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {summary.result || "Pending"}
                                </span>
                              </td>

                              {/* Rank */}
                              <td className="py-2.5 px-3 bg-amber-50/60 font-black text-amber-900 border-r border-amber-200">
                                {summary.rank ? `#${summary.rank}` : "-"}
                              </td>

                              {/* Single Student 2-Sided Marksheet Button */}
                              <td className="py-2.5 px-2 text-center print:hidden border-l border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => openMarksheetModal(stRec.student)}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 mx-auto text-xs font-bold border border-indigo-200 hover:border-indigo-600 shadow-xs"
                                  title="View & Print Official 2-Sided Marksheet"
                                >
                                  <FaGraduationCap size={14} />
                                  <span className="text-[11px]">Marksheet</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ===================== CUMULATIVE 6-EXAM MASTER LEDGER ===================== */
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-purple-50/70 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-purple-950 flex items-center gap-2">
                      <FaAward className="text-purple-700" />
                      <span>Annual Cumulative Master Ledger (6-Assessments Combined)</span>
                    </h3>
                    <p className="text-xs text-purple-700 mt-0.5">
                      Combined evaluation across FA-I (25), FA-II (25), SA-I (60), FA-III (25), FA-IV (25), SA-II (60) = 220 Marks / Subject
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[75vh]">
                  <table className="w-full text-center border-collapse border border-gray-200 text-xs">
                    <thead className="sticky top-0 bg-slate-100 z-30 shadow-sm text-gray-700 text-[11px] font-bold">
                      <tr className="border-b border-gray-300">
                        <th className="sticky left-0 bg-slate-100 z-40 py-2.5 px-3 min-w-[50px] border-r border-gray-300">
                          Roll
                        </th>
                        <th className="sticky left-[50px] bg-slate-100 z-40 py-2.5 px-4 min-w-[170px] text-left border-r border-gray-300">
                          Student Name
                        </th>

                        {/* Subject Grand Total Columns (Max 220M each) */}
                        {classData?.subjects?.map((subName) => (
                          <th
                            key={subName}
                            className="py-2.5 px-3 min-w-[120px] border-r border-gray-200 text-center bg-purple-50/40 text-purple-950"
                          >
                            <div className="font-extrabold text-xs">{subName}</div>
                            <div className="text-[10px] text-purple-700 font-bold">(Out of 220M)</div>
                          </th>
                        ))}

                        <th className="py-2.5 px-3 min-w-[90px] bg-indigo-100 text-indigo-950 border-l-2 border-r border-indigo-300 font-black">
                          Grand Total
                        </th>
                        <th className="py-2.5 px-3 min-w-[70px] bg-emerald-100 text-emerald-950 border-r border-emerald-300 font-black">
                          Annual %
                        </th>
                        <th className="py-2.5 px-3 min-w-[60px] bg-purple-100 text-purple-950 border-r border-purple-300 font-black">
                          Grade
                        </th>
                        <th className="py-2.5 px-3 min-w-[60px] bg-amber-100 text-amber-950 font-black border-r border-amber-300">
                          Annual Rank
                        </th>
                        <th className="py-2.5 px-3 min-w-[70px] bg-slate-100 text-gray-700 font-black print:hidden">
                          Marksheet
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {cumulativeData?.cumulativeRecords?.map((stRec, idx) => (
                        <tr
                          key={stRec.student || idx}
                          className="hover:bg-purple-50/30 transition group"
                        >
                          <td className="sticky left-0 bg-white group-hover:bg-slate-50 z-20 py-2.5 px-3 font-bold font-mono text-gray-900 border-r border-gray-300">
                            #{stRec.rollNumber || idx + 1}
                          </td>
                          <td className="sticky left-[50px] bg-white group-hover:bg-slate-50 z-20 py-2.5 px-4 text-left font-bold text-gray-900 border-r border-gray-300">
                            {stRec.studentName}
                          </td>

                          {/* Subject Breakdown Totals */}
                          {stRec.subjects?.map((sub) => (
                            <td
                              key={sub.subjectName}
                              className="py-2.5 px-3 border-r border-gray-200 font-semibold text-xs"
                            >
                              <span className="font-bold text-gray-900">{sub.grandTotal}</span>
                              <span className="text-gray-400 text-[10px]"> / 220</span>
                              <span className="block text-[10px] text-purple-700 font-bold">
                                {sub.percentage}% ({sub.grade})
                              </span>
                            </td>
                          ))}

                          {/* Grand Total */}
                          <td className="py-2.5 px-3 bg-indigo-50/60 font-black text-indigo-950 border-l-2 border-r border-indigo-200 text-sm">
                            {stRec.grandTotal} / {stRec.grandMax}
                          </td>

                          {/* Annual % */}
                          <td className="py-2.5 px-3 bg-emerald-50/60 font-extrabold text-emerald-700 border-r border-emerald-200 text-xs">
                            {stRec.percentage}%
                          </td>

                          {/* Overall Grade */}
                          <td className="py-2.5 px-3 bg-purple-50/60 font-black text-purple-900 border-r border-purple-200">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-black text-xs">
                              {stRec.overallGrade}
                            </span>
                          </td>

                          {/* Annual Rank */}
                          <td className="py-2.5 px-3 bg-amber-50/60 font-black text-amber-900 text-sm border-r border-amber-200">
                            {stRec.rank ? `🏆 #${stRec.rank}` : "-"}
                          </td>

                          {/* 2-Sided Marksheet Button */}
                          <td className="py-2.5 px-2 text-center print:hidden border-l border-gray-200">
                            <button
                              type="button"
                              onClick={() => openMarksheetModal(stRec.student)}
                              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-700 text-purple-800 hover:text-white rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 mx-auto text-xs font-bold border border-purple-200 hover:border-purple-700 shadow-xs"
                              title="View & Print Official 2-Sided Marksheet"
                            >
                              <FaGraduationCap size={14} />
                              <span className="text-[11px]">Marksheet</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===================== OFFICIAL 2-SIDED STUDENT MARKSHEET MODAL ===================== */}
      <FinalMarksheetModal
        isOpen={marksheetModalOpen}
        onClose={() => setMarksheetModalOpen(false)}
        teacherId={teacher?._id}
        studentId={selectedStudentIdForMarksheet}
        studentList={
          selectedExam === "CUMULATIVE"
            ? cumulativeData?.cumulativeRecords || []
            : marksSheet?.records || []
        }
        academicYear={academicYear}
      />
    </div>
  );
};
