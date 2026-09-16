import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaAward,
  FaCheckCircle,
  FaSchool,
  FaUserGraduate,
  FaCalendarAlt,
  FaBookOpen,
  FaGraduationCap,
  FaStamp,
  FaFileAlt,
  FaSyncAlt,
  FaExchangeAlt,
  FaLayerGroup,
  FaQuestionCircle,
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export const FinalMarksheetModal = ({
  isOpen,
  onClose,
  teacherId,
  studentId,
  studentList = [],
  academicYear = "2026-2027",
}) => {
  const [currentStudentId, setCurrentStudentId] = useState(studentId);
  const [isFlipped, setIsFlipped] = useState(false); // false = Front (Side A), true = Back (Side B)
  const [printMode, setPrintMode] = useState("both"); // "sideA", "sideB", "both"
  const [loading, setLoading] = useState(true);
  const [reportCardData, setReportCardData] = useState(null);

  useEffect(() => {
    if (studentId) {
      setCurrentStudentId(studentId);
      setIsFlipped(false); // Reset to front side on student change
    }
  }, [studentId]);

  // Fetch student detailed report card from backend
  const fetchReportCard = async (sId) => {
    if (!teacherId || !sId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/marks/${teacherId}/student/${sId}/report-card?year=${academicYear}`
      );
      if (res.data?.data) {
        setReportCardData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching student report card:", err);
      Swal.fire({
        icon: "error",
        title: "Report Card Error",
        text: err.response?.data?.message || "Failed to load student marksheet details.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentStudentId) {
      fetchReportCard(currentStudentId);
    }
  }, [isOpen, currentStudentId, academicYear]);

  if (!isOpen) return null;

  // Navigate to previous/next student
  const currentIndex = studentList.findIndex(
    (s) => String(s._id || s.student) === String(currentStudentId)
  );

  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      const prev = studentList[currentIndex - 1];
      setCurrentStudentId(prev._id || prev.student);
      setIsFlipped(false);
    }
  };

  const handleNextStudent = () => {
    if (currentIndex < studentList.length - 1) {
      const next = studentList[currentIndex + 1];
      setCurrentStudentId(next._id || next.student);
      setIsFlipped(false);
    }
  };

  // Dedicated Print handler for single-side or duplex
  const handleExecutePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const school = reportCardData?.school || {};
  const student = reportCardData?.student || {};
  const teacher = reportCardData?.classTeacher || {};
  const stageInfo = reportCardData?.stageInfo || {};
  const attendance = reportCardData?.attendance || {};
  const subjects = reportCardData?.subjectEvaluation || [];
  const summary = reportCardData?.overallSummary || {};
  const coScholastic = reportCardData?.coScholastic || [];
  const gradingLegend = reportCardData?.gradingScaleLegend || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Outer Modal Frame */}
      <div className="bg-slate-900/90 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] my-auto border border-indigo-500/30">
        
        {/* ======================= TOP ACTION & CONTROLS HEADER (Hidden in Print) ======================= */}
        <div className="no-print bg-[#1a1a52] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/80 shadow-md">
          
          {/* Left: Student Identity & Active Side Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-indigo-950 flex items-center justify-center font-bold text-lg shadow-inner">
              <FaGraduationCap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  {student.name || "Student Marksheet"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono">
                  Roll #{student.rollNumber || "N/A"}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                    !isFlipped
                      ? "bg-blue-500/30 text-blue-200 border border-blue-400/40"
                      : "bg-purple-500/30 text-purple-200 border border-purple-400/40"
                  }`}
                >
                  {!isFlipped ? "Viewing: Side A (Profile)" : "Viewing: Side B (Results)"}
                </span>
              </div>
              <p className="text-xs text-indigo-300">
                {student.className} • Academic Session: {academicYear}
              </p>
            </div>
          </div>

          {/* Student Switcher (Prev/Next) */}
          {studentList.length > 1 && (
            <div className="flex items-center gap-1.5 bg-indigo-950/80 px-2.5 py-1 rounded-xl border border-indigo-700/50">
              <button
                onClick={handlePrevStudent}
                disabled={currentIndex <= 0}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  currentIndex <= 0
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-indigo-700 cursor-pointer"
                }`}
                title="Previous Student Marksheet"
              >
                <FaChevronLeft size={11} /> Prev
              </button>
              <span className="text-xs text-amber-300 font-mono font-bold px-2">
                {currentIndex + 1} / {studentList.length}
              </span>
              <button
                onClick={handleNextStudent}
                disabled={currentIndex >= studentList.length - 1}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  currentIndex >= studentList.length - 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-indigo-700 cursor-pointer"
                }`}
                title="Next Student Marksheet"
              >
                Next <FaChevronRight size={11} />
              </button>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Flip Quick Toggle Button */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border border-indigo-400/30"
              title="Flip to other side of marksheet"
            >
              <FaSyncAlt className={`transition-transform duration-500 ${isFlipped ? "rotate-180" : ""}`} size={12} />
              <span>{!isFlipped ? "Flip to Side B ➔" : "← Flip to Side A"}</span>
            </button>

            {/* Print Options Group */}
            <div className="flex items-center bg-indigo-950 p-1 rounded-xl border border-indigo-800">
              <button
                onClick={() => handleExecutePrint("sideA")}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-200 hover:text-white hover:bg-indigo-800/80 rounded-lg transition cursor-pointer"
                title="Print Front Side (Side A) only"
              >
                🖨️ Side A
              </button>
              <button
                onClick={() => handleExecutePrint("sideB")}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-200 hover:text-white hover:bg-indigo-800/80 rounded-lg transition cursor-pointer"
                title="Print Back Side (Side B) only"
              >
                🖨️ Side B
              </button>
              <button
                onClick={() => handleExecutePrint("both")}
                className="px-3 py-1 text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-sm cursor-pointer flex items-center gap-1"
                title="Print Both Sides (Duplex / 2-Pages)"
              >
                <FaPrint size={11} />
                <span>Both Sides</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/80 rounded-xl transition cursor-pointer"
              title="Close Marksheet"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* ======================= MARKSHEET 3D FLIP CONTAINER ======================= */}
        <div
          className={`flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-200/90 marksheet-print-container print-mode-${printMode}`}
        >
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-indigo-900 font-semibold text-sm">
                Generating student official marksheet...
              </p>
            </div>
          ) : !reportCardData ? (
            <div className="p-8 text-center text-gray-500">No marksheet data found.</div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-5">
              
              {/* 3D Perspective Card View (In Screen View) */}
              <div className="screen-flip-view">
                {!isFlipped ? (
                  /* ========================================================================= */
                  /* 🏛️ SIDE A: INSTITUTIONAL & STUDENT PROFILE (Front Face)                  */
                  /* ========================================================================= */
                  <div className="marksheet-page marksheet-sideA bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border-4 border-[#1e1e62] relative text-slate-800 transition-all duration-500">
                    {/* Decorative Certificate Corner Accents */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

                    {/* Top Ribbon */}
                    <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider">
                      <span className="font-bold text-indigo-900">SIDE A: INSTITUTIONAL & CANDIDATE PROFILE</span>
                      <span className="text-indigo-800 font-bold">
                        ACADEMIC SESSION: {academicYear}
                      </span>
                    </div>

                    {/* 🏫 TOP HALF: SCHOOL DETAILS */}
                    <div className="text-center pb-6 border-b-2 border-indigo-950/20">
                      <div className="flex justify-center mb-3">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-700 text-amber-300 flex flex-col items-center justify-center shadow-lg border-2 border-amber-400">
                          <FaSchool size={34} />
                          <span className="text-[9px] font-extrabold uppercase tracking-tighter text-white mt-0.5">
                            EduNexus
                          </span>
                        </div>
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e1e62] tracking-tight uppercase">
                        {school.schoolName}
                      </h1>
                      <p className="text-xs text-gray-600 font-medium mt-1">
                        {school.address} • Contact: {school.contactNumber} • Email: {school.email}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs font-semibold text-indigo-900">
                        <span className="px-3 py-0.5 bg-indigo-50 rounded-full border border-indigo-200">
                          Affiliation No: {school.affiliationNo}
                        </span>
                        <span className="px-3 py-0.5 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
                          School Code: {school.schoolCode}
                        </span>
                      </div>

                      <div className="mt-5 inline-block bg-gradient-to-r from-indigo-900 to-blue-900 text-white px-8 py-2 rounded-xl shadow-md">
                        <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-amber-300">
                          ANNUAL STUDENT PROGRESS REPORT & EVALUATION RECORD
                        </h2>
                      </div>
                    </div>

                    {/* 👤 BOTTOM HALF: STUDENT & FAMILY PROFILE */}
                    <div className="mt-6">
                      <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FaUserGraduate className="text-indigo-600" /> Candidate Demographic & Family Profile
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                        {/* Avatar Tag */}
                        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-slate-200 text-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
                            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                          </div>
                          <p className="font-extrabold text-indigo-950 text-base mt-2 truncate w-full">
                            {student.name}
                          </p>
                          <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-xs rounded-full mt-1">
                            {student.className}
                          </span>
                        </div>

                        {/* Student Details Grid */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Roll Number</span>
                            <span className="font-bold text-slate-800 text-sm">{student.rollNumber}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Admission / Scholar No.</span>
                            <span className="font-bold text-slate-800 text-sm">{student.admissionNo}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Father's / Guardian's Name</span>
                            <span className="font-bold text-slate-800 text-sm">{student.parentName}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Contact Phone</span>
                            <span className="font-bold text-slate-800 text-sm">{student.parentPhone}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Gender / Blood Group</span>
                            <span className="font-bold text-slate-800 text-sm">
                              {student.gender} • {student.bloodGroup}
                            </span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Class Teacher</span>
                            <span className="font-bold text-indigo-800 text-sm">
                              {teacher.name || "Assigned Teacher"}
                            </span>
                          </div>
                          <div className="sm:col-span-2 p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-gray-500 block font-medium">Residential Address</span>
                            <span className="font-semibold text-slate-700">
                              {student.address || "Local City Residence"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 📅 ATTENDANCE & CONDUCT SECTION */}
                    <div className="mt-6">
                      <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-600" /> Cumulative Attendance & Participation
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <span className="text-[11px] font-semibold text-blue-800 block">Total Working Days</span>
                          <span className="text-lg font-extrabold text-blue-950">{attendance.totalWorkingDays}</span>
                        </div>
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <span className="text-[11px] font-semibold text-emerald-800 block">Days Present</span>
                          <span className="text-lg font-extrabold text-emerald-950">{attendance.presentDays}</span>
                        </div>
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                          <span className="text-[11px] font-semibold text-rose-800 block">Days Absent</span>
                          <span className="text-lg font-extrabold text-rose-950">{attendance.absentDays}</span>
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                          <span className="text-[11px] font-semibold text-purple-800 block">Attendance Rate</span>
                          <span className="text-lg font-extrabold text-purple-950">{attendance.percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Side A Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center text-xs text-gray-500">
                      <p>
                        Issued by <span className="font-bold text-gray-700">{school.schoolName}</span> • Student Record File
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        className="no-print font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                      >
                        Turn over for Academic Evaluation (Side B) ➔
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* 📊 SIDE B: ACADEMIC PERFORMANCE & RESULT LEDGER (Back Face)               */
                  /* ========================================================================= */
                  <div className="marksheet-page marksheet-sideB bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border-4 border-[#1e1e62] relative text-slate-800 transition-all duration-500">
                    {/* Decorative Certificate Corner Accents */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

                    {/* Side B Header Ribbon */}
                    <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">
                      <span className="font-bold text-indigo-900">SIDE B: SCHOLASTIC & CO-SCHOLASTIC PERFORMANCE</span>
                      <span className="text-indigo-800 font-bold">
                        STAGE: {stageInfo.resultStatus || "In Progress"}
                      </span>
                    </div>

                    {/* Mini Candidate Bar */}
                    <div className="flex flex-wrap items-center justify-between bg-[#1e1e62] text-white px-5 py-3 rounded-xl mb-5 shadow-sm">
                      <div>
                        <span className="text-xs text-amber-300 font-medium block">Candidate Full Name</span>
                        <h2 className="text-lg font-extrabold tracking-wide">{student.name}</h2>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <div className="bg-white/10 px-3 py-1 rounded-lg">
                          <span className="text-indigo-200 block text-[10px]">CLASS & SECTION</span>
                          <span>{student.className}</span>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-lg">
                          <span className="text-indigo-200 block text-[10px]">ROLL NO</span>
                          <span>{student.rollNumber}</span>
                        </div>
                        <div className="bg-amber-400 text-indigo-950 px-3 py-1 rounded-lg font-bold">
                          <span className="text-indigo-950/80 block text-[10px]">MERIT RANK</span>
                          <span>#{summary.meritRank} of {summary.totalStudentsInClass}</span>
                        </div>
                      </div>
                    </div>

                    {/* 📑 PART I: SCHOLASTIC ASSESSMENT LEDGER (6 EXAMS PROGRESSIVE) */}
                    <div className="mb-6 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                          <FaBookOpen className="text-indigo-600" /> Part I: Scholastic Assessment (Academic Ledger)
                        </h3>
                        <span className="text-[11px] text-gray-500 font-medium italic">
                          * Progressive evaluation filled up to {stageInfo.latestConductedExam || "FA-I"}
                        </span>
                      </div>

                      <table className="w-full text-xs text-left border-collapse border border-slate-300">
                        <thead>
                          {/* Top Group Headers */}
                          <tr className="bg-indigo-900 text-white text-center font-bold">
                            <th rowSpan={2} className="p-2 border border-slate-400 text-left w-36">
                              Subject Curriculum
                            </th>
                            <th colSpan={4} className="p-1.5 border border-slate-400 bg-blue-900">
                              TERM 1 (Max 110M)
                            </th>
                            <th colSpan={4} className="p-1.5 border border-slate-400 bg-indigo-950">
                              TERM 2 (Max 110M)
                            </th>
                            <th colSpan={3} className="p-1.5 border border-slate-400 bg-amber-600">
                              FINAL AGGREGATE
                            </th>
                          </tr>
                          {/* Sub Column Headers */}
                          <tr className="bg-slate-100 text-slate-800 text-center font-bold text-[11px]">
                            <th className="p-1.5 border border-slate-300 bg-blue-50/70">FA-I (25)</th>
                            <th className="p-1.5 border border-slate-300 bg-blue-50/70">FA-II (25)</th>
                            <th className="p-1.5 border border-slate-300 bg-blue-100">SA-I (60)</th>
                            <th className="p-1.5 border border-slate-300 bg-blue-200/80">T1 Total</th>

                            <th className="p-1.5 border border-slate-300 bg-indigo-50/70">FA-III (25)</th>
                            <th className="p-1.5 border border-slate-300 bg-indigo-50/70">FA-IV (25)</th>
                            <th className="p-1.5 border border-slate-300 bg-indigo-100">SA-II (60)</th>
                            <th className="p-1.5 border border-slate-300 bg-indigo-200/80">T2 Total</th>

                            <th className="p-1.5 border border-slate-300 bg-amber-50">Grand (220)</th>
                            <th className="p-1.5 border border-slate-300 bg-amber-50">%</th>
                            <th className="p-1.5 border border-slate-300 bg-amber-100">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((sub, idx) => {
                            const fa1 = sub.exams["FA-I"];
                            const fa2 = sub.exams["FA-II"];
                            const sa1 = sub.exams["SA-I"];
                            const fa3 = sub.exams["FA-III"];
                            const fa4 = sub.exams["FA-IV"];
                            const sa2 = sub.exams["SA-II"];

                            return (
                              <tr
                                key={idx}
                                className={`text-center hover:bg-slate-50 font-medium ${
                                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                                }`}
                              >
                                <td className="p-2 border border-slate-300 text-left font-bold text-indigo-950">
                                  {sub.subjectName}
                                </td>

                                {/* Term 1 Assessment Scores */}
                                <td className="p-1.5 border border-slate-300">
                                  {fa1.isEvaluated ? (
                                    fa1.isAbsent ? (
                                      <span className="text-red-600 font-bold">AB</span>
                                    ) : (
                                      fa1.marksObtained
                                    )
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                                <td className="p-1.5 border border-slate-300">
                                  {fa2.isEvaluated ? (
                                    fa2.isAbsent ? (
                                      <span className="text-red-600 font-bold">AB</span>
                                    ) : (
                                      fa2.marksObtained
                                    )
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                                <td className="p-1.5 border border-slate-300 font-semibold">
                                  {sa1.isEvaluated ? (
                                    sa1.isAbsent ? (
                                      <span className="text-red-600 font-bold">AB</span>
                                    ) : (
                                      sa1.marksObtained
                                    )
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                                <td className="p-1.5 border border-slate-300 bg-blue-50/80 font-bold text-blue-900">
                                  {sub.term1.maxMarks > 0 ? sub.term1.obtained : "-"}
                                </td>

                                {/* Term 2 Assessment Scores */}
                                <td className="p-1.5 border border-slate-300">
                                  {fa3.isEvaluated ? (
                                    fa3.isAbsent ? (
                                      <span className="text-red-600 font-bold">AB</span>
                                    ) : (
                                      fa3.marksObtained
                                    )
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                                <td className="p-1.5 border border-slate-300">
                                  {fa4.isEvaluated ? (
                                    fa4.isAbsent ? (
                                      <span className="text-red-600 font-bold">AB</span>
                                    ) : (
                                      fa4.marksObtained
                                    )
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                                <td className="p-1.5 border border-slate-300 font-semibold">
                                  {sa2.isEvaluated ? (
                                    sa2.isAbsent ? (
                                      <span className="text-red-600 font-bold">AB</span>
                                    ) : (
                                      sa2.marksObtained
                                    )
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                                <td className="p-1.5 border border-slate-300 bg-indigo-50/80 font-bold text-indigo-900">
                                  {sub.term2.maxMarks > 0 ? sub.term2.obtained : "-"}
                                </td>

                                {/* Grand Total Column */}
                                <td className="p-1.5 border border-slate-300 bg-amber-50/80 font-extrabold text-amber-950">
                                  {sub.grandTotal.maxMarks > 0 ? sub.grandTotal.obtained : "-"}
                                </td>
                                <td className="p-1.5 border border-slate-300 bg-amber-50/80 font-bold">
                                  {sub.grandTotal.maxMarks > 0 ? `${sub.grandTotal.percentage}%` : "-"}
                                </td>
                                <td className="p-1.5 border border-slate-300 bg-amber-100 font-black text-indigo-900">
                                  {sub.grandTotal.grade}
                                </td>
                              </tr>
                            );
                          })}

                          {/* Grand Total Tally Row */}
                          <tr className="bg-indigo-950 text-white font-extrabold text-center">
                            <td className="p-2 border border-slate-400 text-left uppercase text-amber-300">
                              Overall Aggregate
                            </td>
                            <td colSpan={3} className="p-1.5 border border-slate-400">
                              {summary.totalMaxMarks > 0
                                ? `Evaluated: ${summary.totalObtained} / ${summary.totalMaxMarks}`
                                : "Pending"}
                            </td>
                            <td className="p-1.5 border border-slate-400 bg-blue-800 text-amber-300">
                              {subjects.reduce((acc, s) => acc + s.term1.obtained, 0)}
                            </td>
                            <td colSpan={3} className="p-1.5 border border-slate-400">
                              Annual Standard: {summary.annualStandardMax}M
                            </td>
                            <td className="p-1.5 border border-slate-400 bg-indigo-800 text-amber-300">
                              {subjects.reduce((acc, s) => acc + s.term2.obtained, 0)}
                            </td>
                            <td className="p-1.5 border border-slate-400 bg-amber-600 text-white text-sm">
                              {summary.totalObtained}
                            </td>
                            <td className="p-1.5 border border-slate-400 bg-amber-500 text-indigo-950">
                              {summary.percentage}%
                            </td>
                            <td className="p-1.5 border border-slate-400 bg-amber-400 text-indigo-950 text-sm font-black">
                              {summary.overallGrade}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 🌟 PART II: CO-SCHOLASTIC & PART III: GRADING SCALE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Co-Scholastic Activities */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FaAward className="text-amber-500" /> Part II: Co-Scholastic & Life Skills
                        </h4>
                        <table className="w-full text-[11px] border border-slate-300">
                          <thead>
                            <tr className="bg-slate-200 font-bold text-slate-700">
                              <th className="p-1.5 text-left border border-slate-300">Activity Domain</th>
                              <th className="p-1.5 text-center border border-slate-300 w-16">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coScholastic.map((co, idx) => (
                              <tr key={idx} className="border-b border-slate-200">
                                <td className="p-1.5 border border-slate-300 font-medium text-slate-800">
                                  {co.area}
                                </td>
                                <td className="p-1.5 border border-slate-300 text-center font-bold text-indigo-900 bg-indigo-50/50">
                                  {co.grade}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Official Grading Legend */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                          Part III: 8-Point Grading Scale (Scholastic)
                        </h4>
                        <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                          {gradingLegend.map((g, idx) => (
                            <div
                              key={idx}
                              className="p-1 bg-white border border-slate-200 rounded font-medium"
                            >
                              <span className="font-extrabold text-indigo-900 block text-xs">
                                {g.grade}
                              </span>
                              <span className="text-slate-600 block">{g.marksRange}</span>
                              <span className="text-[9px] text-gray-400">{g.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 📝 PART IV: TEACHER REMARKS & RESULT STATUS */}
                    <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 mb-6 text-xs">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-indigo-950 uppercase tracking-wide">
                          Teacher's Assessment Remarks & Appraisal
                        </h4>
                        <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white">
                          Result: {summary.resultStatus}
                        </span>
                      </div>
                      <p className="italic text-slate-700 font-medium bg-white p-3 rounded-lg border border-indigo-100 shadow-inner">
                        "{summary.teacherRemarks}"
                      </p>
                      <div className="mt-2 flex justify-between items-center text-indigo-900 font-semibold">
                        <span>
                          Annual Promotion Status:{" "}
                          <strong className="text-indigo-950 font-black">{summary.promotionStatus}</strong>
                        </span>
                        <span>Grading Status: <strong>Verified</strong></span>
                      </div>
                    </div>

                    {/* ✍️ PART V: SIGNATURES & OFFICIAL SCHOOL SEAL */}
                    <div className="mt-8 pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
                      <div className="flex flex-col justify-end items-center">
                        <div className="w-36 border-b-2 border-slate-400 mb-1"></div>
                        <span className="font-bold text-slate-800">Class Teacher Signature</span>
                        <span className="text-[10px] text-gray-500">{teacher.name}</span>
                      </div>

                      <div className="flex flex-col justify-end items-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center text-indigo-400 mb-1">
                          <FaStamp size={20} />
                          <span className="text-[8px] font-bold uppercase mt-0.5">School Seal</span>
                        </div>
                        <span className="font-bold text-slate-800">Principal Signature</span>
                        <span className="text-[10px] text-gray-500">Official Seal & Authority</span>
                      </div>

                      <div className="flex flex-col justify-end items-center">
                        <div className="w-36 border-b-2 border-slate-400 mb-1"></div>
                        <span className="font-bold text-slate-800">Parent / Guardian Signature</span>
                        <span className="text-[10px] text-gray-500">Acknowledged & Verified</span>
                      </div>
                    </div>

                    {/* Side B Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                      <button
                        type="button"
                        onClick={() => setIsFlipped(false)}
                        className="no-print font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                      >
                        ← Turn back to Student Profile (Side A)
                      </button>
                      <span>Final Academic Record</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* 🔄 BOTTOM INTERACTIVE FLIP BANNER (Hidden in Print)                      */}
              {/* ========================================================================= */}
              <div className="no-print bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/30">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="p-3 bg-amber-400 text-indigo-950 rounded-xl font-bold shadow-md animate-bounce">
                    <FaSyncAlt size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>Interactive Report Card Flip</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-indigo-950 font-bold">
                        Tip
                      </span>
                    </h4>
                    <p className="text-xs text-indigo-200 mt-0.5">
                      {!isFlipped
                        ? "Currently on Side A (Student & School Profile). Flip to view all 6 assessments & grading matrix!"
                        : "Currently on Side B (Academic Results). Flip back to view institutional & student identity!"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 rounded-xl font-extrabold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaExchangeAlt size={14} />
                    <span>
                      {!isFlipped
                        ? "Flip to Academic Results (Side B) ➔"
                        : "← Flip to Student Profile (Side A)"}
                    </span>
                  </button>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 🖨️ PRINT-ONLY TEMPLATE (Both Side A & Side B with exact page breaks)       */}
              {/* ========================================================================= */}
              <div className="print-only-layout hidden">
                {/* Print Side A */}
                <div className="marksheet-print-page print-sideA">
                  {/* Embedded content of Side A */}
                  <div className="marksheet-page bg-white p-8 rounded-2xl border-4 border-[#1e1e62] relative text-slate-800">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider">
                      <span className="font-bold text-indigo-900">SIDE A: INSTITUTIONAL & CANDIDATE PROFILE</span>
                      <span className="text-indigo-800 font-bold">ACADEMIC SESSION: {academicYear}</span>
                    </div>
                    <div className="text-center pb-6 border-b-2 border-indigo-950/20">
                      <h1 className="text-2xl font-extrabold text-[#1e1e62] tracking-tight uppercase">{school.schoolName}</h1>
                      <p className="text-xs text-gray-600 font-medium mt-1">{school.address} • Contact: {school.contactNumber} • Email: {school.email}</p>
                      <div className="flex justify-center gap-3 mt-2 text-xs font-semibold text-indigo-900">
                        <span className="px-3 py-0.5 bg-indigo-50 rounded-full border border-indigo-200">Affiliation No: {school.affiliationNo}</span>
                        <span className="px-3 py-0.5 bg-amber-50 text-amber-900 rounded-full border border-amber-200">School Code: {school.schoolCode}</span>
                      </div>
                      <div className="mt-4 inline-block bg-indigo-950 text-white px-6 py-1.5 rounded-xl shadow-md">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-300">ANNUAL STUDENT PROGRESS REPORT & EVALUATION RECORD</h2>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">Candidate Demographic & Family Profile</h3>
                      <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Student Full Name</span><span className="font-bold text-slate-900 text-sm">{student.name}</span></div>
                        <div className="p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Roll Number / Class</span><span className="font-bold text-slate-900 text-sm">#{student.rollNumber} • {student.className}</span></div>
                        <div className="p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Father's / Guardian's Name</span><span className="font-bold text-slate-900">{student.parentName}</span></div>
                        <div className="p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Contact Phone</span><span className="font-bold text-slate-900">{student.parentPhone}</span></div>
                        <div className="p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Admission No / Gender</span><span className="font-bold text-slate-900">{student.admissionNo} • {student.gender}</span></div>
                        <div className="p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Class Teacher</span><span className="font-bold text-indigo-900">{teacher.name}</span></div>
                        <div className="col-span-2 p-2 bg-white rounded border border-slate-200"><span className="text-gray-500 block font-medium">Residential Address</span><span className="font-semibold text-slate-700">{student.address || "Local City Residence"}</span></div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Cumulative Attendance & Participation</h3>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg"><span className="text-[10px] block font-semibold text-blue-800">Working Days</span><span className="font-extrabold text-blue-950 text-sm">{attendance.totalWorkingDays}</span></div>
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg"><span className="text-[10px] block font-semibold text-emerald-800">Days Present</span><span className="font-extrabold text-emerald-950 text-sm">{attendance.presentDays}</span></div>
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg"><span className="text-[10px] block font-semibold text-rose-800">Days Absent</span><span className="font-extrabold text-rose-950 text-sm">{attendance.absentDays}</span></div>
                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg"><span className="text-[10px] block font-semibold text-purple-800">Attendance %</span><span className="font-extrabold text-purple-950 text-sm">{attendance.percentage}%</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Side B */}
                <div className="marksheet-print-page print-sideB">
                  <div className="marksheet-page bg-white p-8 rounded-2xl border-4 border-[#1e1e62] relative text-slate-800">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-3 uppercase tracking-wider">
                      <span className="font-bold text-indigo-900">SIDE B: SCHOLASTIC & CO-SCHOLASTIC PERFORMANCE</span>
                      <span className="text-indigo-800 font-bold">STAGE: {stageInfo.resultStatus}</span>
                    </div>
                    <div className="flex justify-between bg-[#1e1e62] text-white px-4 py-2 rounded-lg mb-4 text-xs font-bold">
                      <span>{student.name} • #{student.rollNumber} • {student.className}</span>
                      <span className="text-amber-300">Merit Rank: #{summary.meritRank} of {summary.totalStudentsInClass}</span>
                    </div>
                    <div className="mb-4 overflow-x-auto">
                      <table className="w-full text-[10px] text-left border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-indigo-900 text-white text-center font-bold">
                            <th rowSpan={2} className="p-1.5 border border-slate-400 text-left">Subject</th>
                            <th colSpan={4} className="p-1 border border-slate-400 bg-blue-900">TERM 1 (110M)</th>
                            <th colSpan={4} className="p-1 border border-slate-400 bg-indigo-950">TERM 2 (110M)</th>
                            <th colSpan={3} className="p-1 border border-slate-400 bg-amber-600">FINAL</th>
                          </tr>
                          <tr className="bg-slate-100 text-slate-800 text-center font-bold text-[9px]">
                            <th className="p-1 border border-slate-300">FA-I</th><th className="p-1 border border-slate-300">FA-II</th><th className="p-1 border border-slate-300">SA-I</th><th className="p-1 border border-slate-300 bg-blue-100">T1</th>
                            <th className="p-1 border border-slate-300">FA-III</th><th className="p-1 border border-slate-300">FA-IV</th><th className="p-1 border border-slate-300">SA-II</th><th className="p-1 border border-slate-300 bg-indigo-100">T2</th>
                            <th className="p-1 border border-slate-300 bg-amber-50">Grand</th><th className="p-1 border border-slate-300">%</th><th className="p-1 border border-slate-300 bg-amber-100">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((sub, idx) => (
                            <tr key={idx} className="text-center font-medium">
                              <td className="p-1 border border-slate-300 text-left font-bold text-indigo-950">{sub.subjectName}</td>
                              <td className="p-1 border border-slate-300">{sub.exams["FA-I"].isEvaluated ? sub.exams["FA-I"].marksObtained : "-"}</td>
                              <td className="p-1 border border-slate-300">{sub.exams["FA-II"].isEvaluated ? sub.exams["FA-II"].marksObtained : "-"}</td>
                              <td className="p-1 border border-slate-300 font-semibold">{sub.exams["SA-I"].isEvaluated ? sub.exams["SA-I"].marksObtained : "-"}</td>
                              <td className="p-1 border border-slate-300 bg-blue-50 font-bold text-blue-900">{sub.term1.maxMarks > 0 ? sub.term1.obtained : "-"}</td>
                              <td className="p-1 border border-slate-300">{sub.exams["FA-III"].isEvaluated ? sub.exams["FA-III"].marksObtained : "-"}</td>
                              <td className="p-1 border border-slate-300">{sub.exams["FA-IV"].isEvaluated ? sub.exams["FA-IV"].marksObtained : "-"}</td>
                              <td className="p-1 border border-slate-300 font-semibold">{sub.exams["SA-II"].isEvaluated ? sub.exams["SA-II"].marksObtained : "-"}</td>
                              <td className="p-1 border border-slate-300 bg-indigo-50 font-bold text-indigo-900">{sub.term2.maxMarks > 0 ? sub.term2.obtained : "-"}</td>
                              <td className="p-1 border border-slate-300 bg-amber-50 font-bold">{sub.grandTotal.maxMarks > 0 ? sub.grandTotal.obtained : "-"}</td>
                              <td className="p-1 border border-slate-300 bg-amber-50 font-bold">{sub.grandTotal.maxMarks > 0 ? `${sub.grandTotal.percentage}%` : "-"}</td>
                              <td className="p-1 border border-slate-300 bg-amber-100 font-black">{sub.grandTotal.grade}</td>
                            </tr>
                          ))}
                          <tr className="bg-indigo-950 text-white font-extrabold text-center">
                            <td className="p-1 border border-slate-400 text-left text-amber-300">Total</td>
                            <td colSpan={3} className="p-1 border border-slate-400">{summary.totalObtained} / {summary.totalMaxMarks}</td>
                            <td className="p-1 border border-slate-400 bg-blue-800 text-amber-300">{subjects.reduce((acc, s) => acc + s.term1.obtained, 0)}</td>
                            <td colSpan={3} className="p-1 border border-slate-400">Max: {summary.annualStandardMax}M</td>
                            <td className="p-1 border border-slate-400 bg-indigo-800 text-amber-300">{subjects.reduce((acc, s) => acc + s.term2.obtained, 0)}</td>
                            <td className="p-1 border border-slate-400 bg-amber-600 text-white">{summary.totalObtained}</td>
                            <td className="p-1 border border-slate-400 bg-amber-500 text-indigo-950">{summary.percentage}%</td>
                            <td className="p-1 border border-slate-400 bg-amber-400 text-indigo-950 font-black">{summary.overallGrade}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 mb-4 text-[11px]">
                      <span className="font-bold text-indigo-950 block mb-0.5">Teacher's Remarks:</span>
                      <p className="italic text-slate-700">"{summary.teacherRemarks}"</p>
                      <span className="block mt-1 font-bold text-indigo-900">Promotion Status: {summary.promotionStatus}</span>
                    </div>
                    <div className="mt-6 pt-4 border-t-2 border-slate-300 grid grid-cols-3 gap-4 text-center text-[10px]">
                      <div><div className="w-24 border-b border-slate-400 mx-auto mb-1"></div><span className="font-bold">Class Teacher</span></div>
                      <div><div className="w-10 h-10 rounded-full border border-dashed border-indigo-300 mx-auto mb-1 flex items-center justify-center"><FaStamp size={14} /></div><span className="font-bold">Principal / Seal</span></div>
                      <div><div className="w-24 border-b border-slate-400 mx-auto mb-1"></div><span className="font-bold">Parent / Guardian</span></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Global CSS Print Styles specifically designed for Single-Side and Duplex Printing */}
      <style>{`
        @media print {
          /* Hide EVERYTHING else on the webpage */
          body * {
            visibility: hidden !important;
          }

          /* Show only our dedicated print layout */
          .print-only-layout, .print-only-layout * {
            visibility: visible !important;
          }

          .print-only-layout {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .marksheet-print-page {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Mode: Print Side A Only */
          .print-mode-sideA .print-sideA {
            display: block !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .print-mode-sideA .print-sideB {
            display: none !important;
          }

          /* Mode: Print Side B Only */
          .print-mode-sideB .print-sideA {
            display: none !important;
          }
          .print-mode-sideB .print-sideB {
            display: block !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Mode: Print Both Sides (Duplex / 2-Pages) */
          .print-mode-both .print-sideA {
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .print-mode-both .print-sideB {
            display: block !important;
          }

          .marksheet-page {
            box-shadow: none !important;
            border: 2px solid #1e1e62 !important;
            border-radius: 0 !important;
            margin: 0 auto !important;
            padding: 20px !important;
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
};
