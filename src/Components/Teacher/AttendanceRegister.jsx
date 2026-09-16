import React, { useEffect, useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaLockOpen,
  FaPrint,
  FaSave,
  FaSignOutAlt,
  FaExclamationCircle,
  FaInfoCircle,
  FaSun,
  FaUserGraduate,
  FaCheck,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const AttendanceRegister = () => {
  const navigate = useNavigate();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [hasClass, setHasClass] = useState(true);
  const [classData, setClassData] = useState(null);
  const [register, setRegister] = useState(null);
  const [teacher, setTeacher] = useState(null);

  const [selectedDayForAction, setSelectedDayForAction] = useState(currentDate.getDate());

  // Quick cell status cycling order
  const STATUS_CYCLE = ["Unmarked", "Present", "Absent", "Late", "HalfDay"];

  // Helper: Get weekday label
  const getWeekday = (day) => {
    const d = new Date(selectedYear, selectedMonth - 1, day);
    return WEEKDAYS[d.getDay()];
  };

  const isSunday = (day) => {
    const d = new Date(selectedYear, selectedMonth - 1, day);
    return d.getDay() === 0;
  };

  // Fetch Attendance Register
  const fetchRegister = async (teacherId, month, year) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/attendance/${teacherId}/register?month=${month}&year=${year}`
      );
      const data = res.data?.data;

      if (!data?.hasClass) {
        setHasClass(false);
      } else {
        setHasClass(true);
        setClassData(data.classData);
        setRegister(data.register);
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error fetching register:", err);
      Swal.fire({
        icon: "error",
        title: "Fetch Error",
        text: err.response?.data?.message || "Could not load attendance register.",
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
    fetchRegister(parsedUser._id, selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, navigate]);

  // Handle cell click to toggle status
  const handleCellClick = (studentIndex, dayNumber) => {
    if (!register || register.status === "Completed") return;

    if (isSunday(dayNumber) || (register.holidays || []).includes(dayNumber)) {
      return; // Skip sundays & holidays
    }

    const updatedRecords = [...register.records];
    const targetStudent = updatedRecords[studentIndex];
    if (!targetStudent) return;

    const dayObj = targetStudent.daily.find((d) => d.day === dayNumber);
    if (!dayObj) return;

    // Cycle through status
    const currentIdx = STATUS_CYCLE.indexOf(dayObj.status);
    const nextStatus =
      currentIdx === -1 || currentIdx === STATUS_CYCLE.length - 1
        ? STATUS_CYCLE[1] // Default to Present
        : STATUS_CYCLE[currentIdx + 1];

    dayObj.status = nextStatus;

    // Live update student summary
    targetStudent.summary = calculateStudentSummary(
      targetStudent.daily,
      register.totalDays,
      register.holidays || []
    );

    setRegister((prev) => ({
      ...prev,
      records: updatedRecords,
    }));
    setHasChanges(true);
  };

  // Helper for live summary calculation
  const calculateStudentSummary = (dailyList, totalDays, holidays = []) => {
    let workingDaysCount = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (!isSunday(d) && !holidays.includes(d)) workingDaysCount++;
    }

    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    let holiday = 0;

    dailyList.forEach((entry) => {
      if (isSunday(entry.day) || holidays.includes(entry.day) || entry.status === "Sunday" || entry.status === "Holiday") {
        holiday++;
      } else if (entry.status === "Present") {
        present++;
      } else if (entry.status === "Absent") {
        absent++;
      } else if (entry.status === "Late") {
        late++;
        present++;
      } else if (entry.status === "HalfDay") {
        halfDay++;
        present += 0.5;
      }
    });

    const percentage =
      workingDaysCount > 0
        ? Math.min(100, Math.round((present / workingDaysCount) * 1000) / 10)
        : 0;

    return {
      totalWorkingDays: workingDaysCount,
      presentDays: Math.floor(present),
      absentDays: absent,
      lateDays: late,
      halfDays: halfDay,
      holidayDays: holiday,
      percentage,
    };
  };

  // Quick Action: Mark All Present for a Date
  const handleMarkAllPresentForDate = (targetDay) => {
    if (!register || register.status === "Completed") return;

    if (isSunday(targetDay) || (register.holidays || []).includes(targetDay)) {
      Swal.fire({
        icon: "info",
        title: "Off Day",
        text: `Day ${targetDay} is a Sunday or Holiday.`,
      });
      return;
    }

    const updatedRecords = register.records.map((rec) => {
      const updatedDaily = rec.daily.map((d) => {
        if (d.day === targetDay) {
          return { ...d, status: "Present" };
        }
        return d;
      });
      const summary = calculateStudentSummary(
        updatedDaily,
        register.totalDays,
        register.holidays || []
      );
      return {
        ...rec,
        daily: updatedDaily,
        summary,
      };
    });

    setRegister((prev) => ({
      ...prev,
      records: updatedRecords,
    }));
    setHasChanges(true);

    Swal.fire({
      icon: "success",
      title: `Day ${targetDay} Marked`,
      text: `All students marked Present for Day ${targetDay}. Click 'Save Changes' to store.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Toggle Holiday for a Date
  const handleToggleHoliday = (targetDay) => {
    if (!register || register.status === "Completed") return;

    if (isSunday(targetDay)) {
      Swal.fire({
        icon: "info",
        title: "Sunday",
        text: "Sundays are already observed as weekly holidays.",
      });
      return;
    }

    const currentHolidays = [...(register.holidays || [])];
    const exists = currentHolidays.includes(targetDay);
    const updatedHolidays = exists
      ? currentHolidays.filter((d) => d !== targetDay)
      : [...currentHolidays, targetDay].sort((a, b) => a - b);

    // Update all student records to reflect holiday status
    const updatedRecords = register.records.map((rec) => {
      const updatedDaily = rec.daily.map((d) => {
        if (d.day === targetDay) {
          return { ...d, status: exists ? "Unmarked" : "Holiday" };
        }
        return d;
      });
      const summary = calculateStudentSummary(
        updatedDaily,
        register.totalDays,
        updatedHolidays
      );
      return {
        ...rec,
        daily: updatedDaily,
        summary,
      };
    });

    setRegister((prev) => ({
      ...prev,
      holidays: updatedHolidays,
      records: updatedRecords,
    }));
    setHasChanges(true);
  };

  // Save Draft Changes
  const handleSaveDraft = async () => {
    if (!teacher || !register) return;

    try {
      setSaving(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/attendance/${teacher._id}/save`,
        {
          month: selectedMonth,
          year: selectedYear,
          holidays: register.holidays,
          notes: register.notes,
          records: register.records,
        }
      );

      setHasChanges(false);
      Swal.fire({
        icon: "success",
        title: "Register Saved",
        text: "Daily attendance draft successfully updated in database.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save attendance draft.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Complete & Finalize Monthly Register
  const handleCompleteRegister = async () => {
    if (!teacher || !register) return;

    const workingDays = register.totalWorkingDays || 25;

    const result = await Swal.fire({
      title: `Complete Register for ${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}?`,
      html: `
        <div class="text-left text-sm space-y-2 mt-2">
          <p><strong>Class:</strong> Class ${classData?.classNumber}-${classData?.section}</p>
          <p><strong>Total Students:</strong> ${register.records.length}</p>
          <p><strong>School Working Days:</strong> ${workingDays} Days</p>
          <p class="text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-2">
            ⚠️ <strong>Notice:</strong> Finalizing will compute the official monthly attendance totals (Present, Absent, Holidays & %) for all students and lock the register.
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Finalize & Complete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      try {
        setSaving(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/attendance/${teacher._id}/complete`,
          {
            month: selectedMonth,
            year: selectedYear,
            holidays: register.holidays,
            notes: register.notes,
          }
        );

        setRegister(res.data?.data?.attendance);
        setHasChanges(false);

        Swal.fire({
          icon: "success",
          title: "Register Completed & Finalized!",
          text: `Monthly attendance records for ${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear} have been locked.`,
          confirmButtonColor: "#4F46E5",
        });
      } catch (err) {
        console.error("Complete register error:", err);
        Swal.fire({
          icon: "error",
          title: "Finalization Failed",
          text: err.response?.data?.message || "Could not complete monthly register.",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  // Reopen Completed Register
  const handleReopenRegister = async () => {
    if (!teacher || !register) return;

    const result = await Swal.fire({
      title: "Reopen Attendance Register?",
      text: "Unlocking allows editing daily student attendance marks for this month again.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Reopen Register",
      cancelButtonText: "Keep Locked",
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      try {
        setSaving(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/attendance/${teacher._id}/reopen`,
          {
            month: selectedMonth,
            year: selectedYear,
          }
        );

        setRegister(res.data?.data);
        setHasChanges(false);

        Swal.fire({
          icon: "success",
          title: "Register Reopened",
          text: "You can now edit student marks.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Reopen error:", err);
        Swal.fire({
          icon: "error",
          title: "Reopen Failed",
          text: err.response?.data?.message || "Could not reopen register.",
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

  // Statistics calculation
  const stats = useMemo(() => {
    if (!register || !register.records || register.records.length === 0) {
      return {
        totalStudents: 0,
        workingDays: 0,
        avgAttendance: 0,
      };
    }

    const totalStudents = register.records.length;
    const workingDays = register.totalWorkingDays || 0;
    const avgAttendance =
      register.records.reduce((acc, r) => acc + (r.summary?.percentage || 0), 0) /
      totalStudents;

    return {
      totalStudents,
      workingDays,
      avgAttendance: Math.round(avgAttendance * 10) / 10,
    };
  }, [register]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold text-lg animate-pulse">
          Loading Class Attendance Register...
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
                  EduNexus Register
                </h1>
                <p className="text-[11px] text-indigo-200 font-medium">
                  Classroom Attendance Ledger
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

      {/* ===================== MAIN REGISTER WORKSPACE ===================== */}
      <main className="flex-1 max-w-[98%] w-full mx-auto px-2 sm:px-4 py-6">
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
            {/* ===================== CONTROLS & REGISTER HEADER BAR ===================== */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6"
            >
              {/* Left: Class Title, Month Picker & Status */}
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl font-black text-gray-900">
                      Class {classData?.classNumber}-{classData?.section} Register
                    </h2>
                    {register?.status === "Completed" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                        <FaLock size={11} /> Register Finalized & Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300 animate-pulse">
                        <FaLockOpen size={11} /> Open / Draft Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {classData?.school?.schoolName || teacher?.school?.schoolName} • Daily Student Attendance Sheet
                  </p>
                </div>

                {/* Month & Year Selectors */}
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-1.5 px-2 text-indigo-700">
                    <FaCalendarAlt size={14} />
                  </div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="bg-white border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-white border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
              </div>

              {/* Right: Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Save Draft */}
                {register?.status !== "Completed" && (
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer ${
                      hasChanges
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <FaSave size={14} />
                    <span>{saving ? "Saving..." : hasChanges ? "Save Changes *" : "Draft Saved"}</span>
                  </button>
                )}

                {/* Complete Register (Monthly Finalization) */}
                {register?.status !== "Completed" ? (
                  <button
                    onClick={handleCompleteRegister}
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <FaCheckCircle size={15} />
                    <span>Complete Register</span>
                  </button>
                ) : (
                  <button
                    onClick={handleReopenRegister}
                    disabled={saving}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    <FaLockOpen size={14} />
                    <span>Reopen Register</span>
                  </button>
                )}

                {/* Print Ledger */}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition cursor-pointer"
                >
                  <FaPrint size={14} />
                  <span>Print Ledger</span>
                </button>
              </div>
            </motion.div>

            {/* ===================== SUMMARY STAT TILES ===================== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:hidden">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                  <FaUserGraduate />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-gray-400">Total Students</p>
                  <h4 className="text-xl font-black text-gray-900">{stats.totalStudents}</h4>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                  <FaCalendarAlt />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-gray-400">School Open Days</p>
                  <h4 className="text-xl font-black text-blue-600">{stats.workingDays} Days</h4>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                  <FaSun />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-gray-400">Holidays Marked</p>
                  <h4 className="text-xl font-black text-purple-600">
                    {register?.holidays?.length || 0} Days
                  </h4>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  <FaCheckCircle />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-gray-400">Class Average</p>
                  <h4 className="text-xl font-black text-emerald-600">{stats.avgAttendance}%</h4>
                </div>
              </div>
            </div>

            {/* ===================== QUICK DAILY ACTION TOOLBAR ===================== */}
            {register?.status !== "Completed" && (
              <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-indigo-50/90 p-4 rounded-2xl border border-indigo-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-indigo-600 text-white rounded-lg">
                    <FaClock size={14} />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Quick Daily Batch Action
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Batch mark attendance or declare a school break for a specific date
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-gray-200 text-xs">
                    <span className="text-gray-500 font-medium">Select Day:</span>
                    <select
                      value={selectedDayForAction}
                      onChange={(e) => setSelectedDayForAction(Number(e.target.value))}
                      className="font-bold text-indigo-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: register?.totalDays || 30 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          Day {d} ({getWeekday(d)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleMarkAllPresentForDate(selectedDayForAction)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Mark All Present (Day {selectedDayForAction})
                  </button>

                  <button
                    onClick={() => handleToggleHoliday(selectedDayForAction)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                      (register?.holidays || []).includes(selectedDayForAction)
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-white hover:bg-gray-100 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {(register?.holidays || []).includes(selectedDayForAction)
                      ? "Remove Holiday"
                      : "Mark as Holiday"}
                  </button>
                </div>
              </div>
            )}

            {/* ===================== SPREADSHEET LEDGER TABLE ===================== */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Legend Bar */}
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/70 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2 print:hidden">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                    Status Legend:
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] border border-emerald-300">
                      P
                    </span>
                    <span>Present</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-[10px] border border-rose-300">
                      A
                    </span>
                    <span>Absent</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] border border-amber-300">
                      L
                    </span>
                    <span>Late</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-[10px] border border-orange-300">
                      HD
                    </span>
                    <span>Half Day</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px] border border-purple-300">
                      H
                    </span>
                    <span>Holiday</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-[10px]">
                      S
                    </span>
                    <span>Sunday</span>
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 italic">
                  💡 Tip: Click any cell to cycle status (Unmarked → P → A → L → HD).
                </div>
              </div>

              {/* Scrollable Register Grid */}
              <div className="overflow-x-auto max-h-[68vh]">
                <table className="w-full text-center border-collapse border border-gray-200 text-xs">
                  <thead className="sticky top-0 bg-slate-100 z-30 shadow-sm">
                    {/* Row 1: Header Titles */}
                    <tr className="border-b border-gray-300 text-gray-700 text-[11px] font-bold">
                      <th className="sticky left-0 bg-slate-100 z-40 py-2.5 px-3 min-w-[50px] border-r border-gray-300">
                        Roll
                      </th>
                      <th className="sticky left-[50px] bg-slate-100 z-40 py-2.5 px-4 min-w-[160px] text-left border-r border-gray-300">
                        Student Name
                      </th>
                      <th className="py-2.5 px-2 min-w-[45px] border-r border-gray-300">
                        Gen
                      </th>

                      {/* Day Number Columns (1 to 28/29/30/31) */}
                      {Array.from({ length: register?.totalDays || 30 }, (_, i) => i + 1).map((day) => {
                        const isSun = isSunday(day);
                        const isHol = (register?.holidays || []).includes(day);

                        return (
                          <th
                            key={day}
                            className={`py-1.5 px-1 min-w-[34px] border-r border-gray-200 text-center select-none ${
                              isSun
                                ? "bg-gray-200 text-gray-700"
                                : isHol
                                ? "bg-purple-100 text-purple-800"
                                : "hover:bg-slate-200 transition cursor-pointer"
                            }`}
                            onClick={() => {
                              if (!isSun && !isHol && register?.status !== "Completed") {
                                handleMarkAllPresentForDate(day);
                              }
                            }}
                            title={`Click to mark all Present for Day ${day}`}
                          >
                            <div className="font-extrabold text-[12px]">{day}</div>
                            <div
                              className={`text-[9px] font-semibold uppercase ${
                                isSun ? "text-red-600" : isHol ? "text-purple-700" : "text-gray-400"
                              }`}
                            >
                              {getWeekday(day)}
                            </div>
                          </th>
                        );
                      })}

                      {/* Summary Columns Header on Right */}
                      <th className="py-2 px-3 min-w-[65px] bg-blue-50 text-blue-900 border-l-2 border-r border-blue-200">
                        Opens
                      </th>
                      <th className="py-2 px-3 min-w-[55px] bg-emerald-50 text-emerald-900 border-r border-emerald-200">
                        P
                      </th>
                      <th className="py-2 px-3 min-w-[55px] bg-rose-50 text-rose-900 border-r border-rose-200">
                        A
                      </th>
                      <th className="py-2 px-3 min-w-[55px] bg-purple-50 text-purple-900 border-r border-purple-200">
                        H
                      </th>
                      <th className="py-2 px-3 min-w-[70px] bg-slate-200 text-gray-900 border-l border-gray-300">
                        % Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {register?.records?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={(register?.totalDays || 30) + 8}
                          className="py-12 text-center text-gray-400"
                        >
                          No students enrolled in this class yet.
                        </td>
                      </tr>
                    ) : (
                      register?.records?.map((studentRec, stIdx) => {
                        const summary = studentRec.summary || {};
                        const pct = summary.percentage || 0;

                        return (
                          <tr
                            key={studentRec.student || stIdx}
                            className="hover:bg-indigo-50/30 transition group"
                          >
                            {/* Sticky Roll Number */}
                            <td className="sticky left-0 bg-white group-hover:bg-slate-50 z-20 py-2.5 px-3 font-bold font-mono text-gray-900 border-r border-gray-300">
                              #{studentRec.rollNumber || stIdx + 1}
                            </td>

                            {/* Sticky Student Name */}
                            <td className="sticky left-[50px] bg-white group-hover:bg-slate-50 z-20 py-2.5 px-4 text-left font-bold text-gray-900 border-r border-gray-300 truncate max-w-[160px]">
                              {studentRec.studentName}
                            </td>

                            {/* Gender */}
                            <td className="py-2.5 px-1 border-r border-gray-200 text-gray-500 font-semibold text-[11px]">
                              {studentRec.gender === "Female" ? "F" : "M"}
                            </td>

                            {/* Day Cells (1 to 28/29/30/31) */}
                            {studentRec.daily?.map((dayEntry) => {
                              const dayNum = dayEntry.day;
                              const isSun = isSunday(dayNum);
                              const isHol = (register?.holidays || []).includes(dayNum);
                              const st = dayEntry.status;

                              let cellBg = "bg-white hover:bg-slate-100 cursor-pointer";
                              let badge = (
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              );

                              if (isSun || st === "Sunday") {
                                cellBg = "bg-gray-100 text-gray-500 cursor-not-allowed";
                                badge = (
                                  <span className="font-bold text-[10px] text-gray-400">S</span>
                                );
                              } else if (isHol || st === "Holiday") {
                                cellBg = "bg-purple-50 text-purple-700 cursor-not-allowed";
                                badge = (
                                  <span className="font-extrabold text-[10px] text-purple-600">
                                    H
                                  </span>
                                );
                              } else if (st === "Present") {
                                cellBg = "bg-emerald-50/70 hover:bg-emerald-100 cursor-pointer";
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                                    P
                                  </span>
                                );
                              } else if (st === "Absent") {
                                cellBg = "bg-rose-50 hover:bg-rose-100 cursor-pointer";
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-rose-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                                    A
                                  </span>
                                );
                              } else if (st === "Late") {
                                cellBg = "bg-amber-50 hover:bg-amber-100 cursor-pointer";
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                                    L
                                  </span>
                                );
                              } else if (st === "HalfDay") {
                                cellBg = "bg-orange-50 hover:bg-orange-100 cursor-pointer";
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                                    HD
                                  </span>
                                );
                              }

                              return (
                                <td
                                  key={dayNum}
                                  onClick={() => handleCellClick(stIdx, dayNum)}
                                  className={`p-1 border-r border-gray-200 text-center select-none transition ${cellBg}`}
                                  title={`Student: ${studentRec.studentName} | Day ${dayNum} | Status: ${st}`}
                                >
                                  <div className="flex items-center justify-center min-h-[28px]">
                                    {badge}
                                  </div>
                                </td>
                              );
                            })}

                            {/* Summary Columns */}
                            <td className="py-2.5 px-3 bg-blue-50/60 font-bold text-blue-900 border-l-2 border-r border-blue-200">
                              {summary.totalWorkingDays || register?.totalWorkingDays || 0}
                            </td>

                            <td className="py-2.5 px-3 bg-emerald-50/60 font-extrabold text-emerald-700 border-r border-emerald-200">
                              {summary.presentDays || 0}
                            </td>

                            <td className="py-2.5 px-3 bg-rose-50/60 font-extrabold text-rose-700 border-r border-rose-200">
                              {summary.absentDays || 0}
                            </td>

                            <td className="py-2.5 px-3 bg-purple-50/60 font-bold text-purple-700 border-r border-purple-200">
                              {summary.holidayDays || 0}
                            </td>

                            <td className="py-2.5 px-3 font-black text-xs border-l border-gray-300">
                              <span
                                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                  pct >= 90
                                    ? "bg-emerald-100 text-emerald-800"
                                    : pct >= 75
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {pct}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===================== FOOTER NOTICE & INSTRUCTIONS ===================== */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-gray-500 print:hidden">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-indigo-600 text-base flex-shrink-0" />
                <p>
                  At month end, click <strong className="text-gray-800">Complete Register</strong> to seal and finalize student totals for report cards and official school compliance records.
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={() => navigate("/teacher/my-class")}
                  className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                >
                  View Student Roster →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
