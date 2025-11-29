import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  School,
  Edit,
  Trash2,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ParticularSchool = () => {
  const { schoolCode } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchool = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
      );
    //   console.log(res)
      setSchool(res.data.data.school || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching school:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, []);

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
          setSchool((prevSchool) => ({
            ...prevSchool,
            status: prevSchool.status === "Inactive"
          }));
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
        try {
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/school/update-school-status/${schoolId}`
          );
          setSchool((prevSchool) => ({
            ...prevSchool,
            status: "Active"
          }));
        } catch (error) {
          console.error("Error renewing school:", error);
        }
    }
    }); 
  };

  if (loading) {
    return <p className="p-10 text-gray-600">Loading School details...</p>;
  }

  if (!school) {
    return (
      <p className="p-10 text-red-500">
        School not found or an error occurred.
      </p>
    );
  }

  return (
    <div className="p-6 md:p-10">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/super-admin/manage-schools")}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-6"
      >
        <ArrowLeft size={20} />
        Back to schools
      </button>

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-100 p-4 rounded-full">
              <User size={40} className="text-indigo-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {school.schoolName}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Mail size={18} />
                {school.email}
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium shadow-sm">
              <ShieldCheck size={18} />
              School
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS & SCHOOL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Basic Info */}
        <div className="col-span-2 bg-white rounded-2xl p-8 shadow-md border border-gray-200">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            School Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-indigo-600" />
              <span className="font-medium">Email:</span> {school.email}
            </div>

            {school.contactNumber && (
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={20} className="text-indigo-600" />
                <span className="font-medium">Phone:</span> {school.contactNumber}
              </div>
            )}

            {
              school.address && (
              <div className="flex items-center gap-3 text-gray-700">
                <School size={20} className="text-indigo-600" />
                <span className="font-medium">Address:</span> {school.address}
              </div>
              )
            }
          </div>

        </div>

        {/* RIGHT: Assigned Principal */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Assigned Principal
          </h2>

          {school.principal ? (
            <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                <User size={22} />
                {school.principal.name}
              </h3>

              <p className="text-gray-700 mt-2">
                <span className="font-medium">Email:</span>{" "}
                {school.principal.email}
              </p>

              <button
                onClick={() =>
                  navigate(`/super-admin/principal/${school.principal._id}`)
                }
                className="mt-4 w-full py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                View Principal
              </button>
            </div>
          ) : (
            <div className="text-gray-600 text-center border border-gray-300 rounded-xl p-6 bg-gray-50">
              <School size={40} className="mx-auto text-gray-400 mb-3" />

              <p className="mb-4">No Principal assigned yet.</p>

              <button
                onClick={() => navigate(`/super-admin/school/${schoolCode}/re-assign-principal`)}
                className="mt-2 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <FaPlus size={16} />
                Assign Principal
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-10">

        <button
          onClick={() => navigate(`/super-admin/school/${schoolCode}/edit`)}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 shadow"
        >
          <Edit size={20} />
          Edit School
        </button>

        {
          school.status === 'Active' ?
          (
            <button
              onClick={() => deactivateSchool(school._id)}
              className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 shadow"
            >
              <Trash2 size={20} />
              Deactivate School 
            </button>
          ) :
          (
            <button
              onClick={() => renewSchool(school._id)}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 shadow"
            >
              <RefreshCcw size={20} />
              Activate School 
            </button>
          )
        }

      </div>
    </div>
  );
};

export {ParticularSchool};
