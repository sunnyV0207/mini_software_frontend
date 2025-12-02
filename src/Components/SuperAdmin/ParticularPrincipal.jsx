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
  RefreshCcw
} from "lucide-react";
import Swal from "sweetalert2";

const ParticularPrincipal = () => {
  const { principalId } = useParams();
  const navigate = useNavigate();

  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrincipal = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/principal/${principalId}`
      );
    //   console.log(res)
      setPrincipal(res.data.data.principal || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching principal:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrincipal();
  }, []);

  const updatePrincipalStatus = async () => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/principal/${principalId}/update-status`
    ).then((res) => {
      // alert("Principal status updated successfully.");
      navigate("/super-admin/manage-principals");
    }).catch((err) => {
      console.error("Error updating principal status:", err);
      alert("Failed to update principal status. Please try again.");
    });
  };

  const deactivatePrincipal = async () => {
    Swal.fire({
      title: 'Warning',
      text: "Are you sure you want to deactivate principal? You can later activate it.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        updatePrincipalStatus();
      }
    });
  };

  const activatePrincipal = async () => {
    Swal.fire({
      title: 'Warning',
      text: "Are you sure you want to activate principal? You can later deactivate it.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        updatePrincipalStatus();
      }
    });
  };

  if (loading) {
    return <p className="p-10 text-gray-600">Loading principal details...</p>;
  }

  if (!principal) {
    return (
      <p className="p-10 text-red-500">
        Principal not found or an error occurred.
      </p>
    );
  }

  return (
    <div className="p-6 md:p-10">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/super-admin/manage-principals")}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-6"
      >
        <ArrowLeft size={20} />
        Back to Principals
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
                {principal.name}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Mail size={18} />
                {principal.email}
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium shadow-sm">
              <ShieldCheck size={18} />
              Principal
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS & SCHOOL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Basic Info */}
        <div className="col-span-2 bg-white rounded-2xl p-8 shadow-md border border-gray-200">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Principal Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-indigo-600" />
              <span className="font-medium">Email:</span> {principal.email}
            </div>

            {principal.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={20} className="text-indigo-600" />
                <span className="font-medium">Phone:</span> {principal.phone}
              </div>
            )}

            {principal.gender && (
              <div className="flex items-center gap-3 text-gray-700">
                <User size={20} className="text-indigo-600" />
                <span className="font-medium">Gender:</span> {principal.gender}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT: Assigned School */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Assigned School
          </h2>

          {principal.school ? (
            <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                <School size={22} />
                {principal.school.schoolName}
              </h3>

              <p className="text-gray-700 mt-2">
                <span className="font-medium">School Code:</span>{" "}
                {principal.school.schoolCode}
              </p>

              <button
                onClick={() =>
                  navigate(`/super-admin/school/${principal.school.schoolCode}`)
                }
                className="mt-4 w-full py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                View School
              </button>
            </div>
          ) : (
            <div className="text-gray-600 text-center border border-gray-300 rounded-xl p-6 bg-gray-50">
              <School size={40} className="mx-auto text-gray-400 mb-3" />
              No school assigned yet.
            </div>
          )}

        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-10">

        <button
          onClick={() => navigate(`/super-admin/principal/${principal._id}/edit`)}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 shadow"
        >
          <Edit size={20} />
          Edit Principal
        </button>

        {
          principal.status === "Active" ?
          <button
            onClick={deactivatePrincipal}
            className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 shadow"
          >
            <Trash2 size={20} />
            Deactivate Principal
          </button> :
          <button
            onClick={activatePrincipal}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 shadow"
          >
            <RefreshCcw size={20} />
            Activate Principal
          </button>
        }

      </div>
    </div>
  );
};

export {ParticularPrincipal};
