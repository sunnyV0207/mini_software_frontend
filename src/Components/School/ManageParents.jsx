import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaTrash,
  FaEdit,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaUserGraduate,
  FaBriefcase,
  FaMapMarkerAlt,
  FaTimes,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { RefreshCw, PlusCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const ManageParents = () => {
  const navigate = useNavigate();
  const { schoolCode } = useParams();
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [childrenFilter, setChildrenFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState(null); // For Card Modal

  // Fetch Parents
  const fetchParents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/parents/get-parents`
      );
      const parentsArray = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setParents(parentsArray);
    } catch (error) {
      console.error("Error fetching parents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [schoolCode]);

  // Deactivate Parent
  const deactivateParent = (parentId, e) => {
    if (e) e.stopPropagation();

    Swal.fire({
      title: "Deactivate Parent",
      text: "Are you sure you want to deactivate this parent? You can reactivate them later.",
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
            `${import.meta.env.VITE_BACKEND_URL}/api/parent/update-parent-status/${parentId}`
          );
          setParents((prev) =>
            prev.map((parent) =>
              parent._id === parentId ? { ...parent, status: "Inactive" } : parent
            )
          );
          if (selectedParent && selectedParent._id === parentId) {
            setSelectedParent((prev) => ({ ...prev, status: "Inactive" }));
          }
          Swal.fire({
            icon: "success",
            title: "Deactivated",
            text: "Parent account has been deactivated.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deactivating parent:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to deactivate parent.",
          });
        }
      }
    });
  };

  // Reactivate Parent
  const reactivateParent = (parentId, e) => {
    if (e) e.stopPropagation();

    Swal.fire({
      title: "Activate Parent",
      text: "Are you sure you want to activate this parent?",
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
            `${import.meta.env.VITE_BACKEND_URL}/api/parent/update-parent-status/${parentId}`
          );
          setParents((prev) =>
            prev.map((parent) =>
              parent._id === parentId ? { ...parent, status: "Active" } : parent
            )
          );
          if (selectedParent && selectedParent._id === parentId) {
            setSelectedParent((prev) => ({ ...prev, status: "Active" }));
          }
          Swal.fire({
            icon: "success",
            title: "Activated",
            text: "Parent account has been activated.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error activating parent:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to activate parent.",
          });
        }
      }
    });
  };

  // Filter parents
  const filteredParents = parents.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.phone && p.phone.toLowerCase().includes(term)) ||
      (p.occupation && p.occupation.toLowerCase().includes(term)) ||
      (Array.isArray(p.children) &&
        p.children.some(
          (child) => child.name && child.name.toLowerCase().includes(term)
        ));

    const matchesStatus =
      statusFilter === "All" ||
      (p.status && p.status.toLowerCase() === statusFilter.toLowerCase());

    const childrenCount = Array.isArray(p.children) ? p.children.length : 0;
    const matchesChildren =
      childrenFilter === "All" ||
      (childrenFilter === "WithChildren" && childrenCount > 0) ||
      (childrenFilter === "NoChildren" && childrenCount === 0);

    return matchesSearch && matchesStatus && matchesChildren;
  });

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2.5">
            <FaUsers className="text-indigo-600" /> Manage Parents
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse parent contacts, search by family details, or click any parent to view their full profile card.
          </p>
        </div>

        <button
          onClick={() => navigate(`/school/${schoolCode}/parents/add`)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto font-medium"
        >
          <PlusCircle size={20} />
          Add Parent
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Search */}
        <div className="sm:col-span-2 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
          <FaSearch className="text-gray-400 text-base flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by parent name, email, phone, occupation, child..."
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

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <FaFilter className="text-gray-400 text-xs" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        {/* Children filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <FaUserGraduate className="text-gray-400 text-xs" />
          <select
            value={childrenFilter}
            onChange={(e) => setChildrenFilter(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
          >
            <option value="All">All Families</option>
            <option value="WithChildren">With Linked Children</option>
            <option value="NoChildren">Without Children</option>
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
        <span>
          Showing <strong>{filteredParents.length}</strong> of{" "}
          <strong>{parents.length}</strong> parents
        </span>
        {(search || statusFilter !== "All" || childrenFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setChildrenFilter("All");
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Parents List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredParents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <FaUsers className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-700 text-lg font-medium">No parents found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search filters or click "Add Parent" to register a parent contact.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 sm:px-6">Parent Details</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Occupation</th>
                  <th className="py-3.5 px-4">Linked Children</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredParents.map((parent) => (
                  <tr
                    key={parent._id}
                    onClick={() => setSelectedParent(parent)}
                    className="hover:bg-indigo-50/40 transition cursor-pointer group"
                  >
                    {/* Parent Details */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-105 transition">
                          <FaUsers />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition">
                            {parent.name}
                          </p>
                          <p className="text-xs text-gray-500">{parent.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="flex items-center gap-1.5 text-xs">
                        <FaPhone className="text-gray-400" />
                        {parent.phone || "N/A"}
                      </span>
                    </td>

                    {/* Occupation */}
                    <td className="py-3.5 px-4 text-gray-700 text-xs">
                      {parent.occupation ? (
                        <span className="inline-flex items-center gap-1 font-medium text-gray-800">
                          <FaBriefcase className="text-gray-400" size={11} /> {parent.occupation}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>

                    {/* Linked Children */}
                    <td className="py-3.5 px-4">
                      {parent.children && parent.children.length > 0 ? (
                        <div className="flex flex-wrap gap-1 items-center">
                          {parent.children.slice(0, 2).map((child) => (
                            <span
                              key={child._id}
                              className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold text-[11px] rounded-md border border-indigo-200"
                            >
                              {child.name}
                            </span>
                          ))}
                          {parent.children.length > 2 && (
                            <span className="text-[11px] text-gray-500 font-medium">
                              +{parent.children.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No Children</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          parent.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {parent.status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedParent(parent)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="View Parent Card"
                        >
                          <FaEye size={15} />
                        </button>

                        <button
                          onClick={() => navigate(`/school/parent/${parent._id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Parent"
                        >
                          <FaEdit size={15} />
                        </button>

                        {parent.status === "Active" ? (
                          <button
                            onClick={(e) => deactivateParent(parent._id, e)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Deactivate Parent"
                          >
                            <FaTrash size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => reactivateParent(parent._id, e)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Activate Parent"
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

      {/* INTERACTIVE PARENT CARD MODAL */}
      {selectedParent && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedParent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden p-6 sm:p-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  selectedParent.status === "Active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {selectedParent.status || "Active"}
              </span>

              <button
                onClick={() => setSelectedParent(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Parent Avatar & Title */}
            <div className="text-center mt-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-4xl shadow-inner mb-3">
                <FaUsers />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedParent.name}
              </h2>
              {selectedParent.occupation ? (
                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">
                  {selectedParent.occupation}
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-0.5">Parent / Guardian</p>
              )}
            </div>

            {/* Contact & Address */}
            <div className="mt-5 space-y-2.5 text-sm text-gray-700 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400 text-base flex-shrink-0" />
                <span className="truncate">{selectedParent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400 text-base flex-shrink-0" />
                <span>{selectedParent.phone || "Not provided"}</span>
              </div>
              {selectedParent.address && (
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400 text-base flex-shrink-0" />
                  <span className="truncate">{selectedParent.address}</span>
                </div>
              )}
            </div>

            {/* Linked Children List */}
            <div className="mt-5 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-900 mb-2.5 flex items-center gap-1.5">
                <FaUserGraduate className="text-indigo-600" />
                Linked Children ({selectedParent.children?.length || 0}):
              </p>

              {selectedParent.children && selectedParent.children.length > 0 ? (
                <div className="space-y-2">
                  {selectedParent.children.map((child) => (
                    <div
                      key={child._id}
                      className="bg-white p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-gray-800">{child.name}</span>
                      {child.class ? (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                          Class {child.class.classNumber}-{child.class.section}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No class assigned</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No students linked to this parent.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedParent(null);
                  navigate(`/school/parent/${selectedParent._id}/edit`);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                <FaEdit size={14} /> Edit Parent
              </button>

              {selectedParent.status === "Active" ? (
                <button
                  onClick={() => deactivateParent(selectedParent._id)}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 px-4 rounded-xl font-semibold text-sm transition"
                >
                  <FaTrash size={13} /> Deactivate
                </button>
              ) : (
                <button
                  onClick={() => reactivateParent(selectedParent._id)}
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

