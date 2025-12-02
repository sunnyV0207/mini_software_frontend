import React, { useEffect, useState } from "react";
import { Search, User, School, Eye, Trash2, PlusCircle, RefreshCcw } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ManagePrincipals = () => {
  const [principals, setPrincipals] = useState([]);
  const [filteredPrincipals, setFilteredPrincipals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch all principals
  const fetchPrincipals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/principal/fetch-principals`
      );
      console.log("Fetched principals:", res);

      const principalList = Array.isArray(res.data.data) ? res.data.data : [];

      setPrincipals(principalList);
      setFilteredPrincipals(principalList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching principals:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrincipals();
  }, []);

  const updatePrincipalStatus = async (principalId) => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/principal/${principalId}/update-status`
    ).then((res) => {
      // alert("Principal status updated successfully.");
      setFilteredPrincipals((prevPrincipals)=>
        prevPrincipals.map((principal)=>
          principal._id === principalId ? {...principal, status: principal.status === "Active" ? "Inactive" : "Active"  } : principal
        ))
      navigate("/super-admin/manage-principals");
    }).catch((err) => {
      console.error("Error updating principal status:", err);
      alert("Failed to update principal status. Please try again.");
    });
  };

  const deactivatePrincipal = async (principalId) => {
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
        updatePrincipalStatus(principalId);
      }
    });
  };

  const activatePrincipal = async (principalId) => {
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
        updatePrincipalStatus(principalId);
      }
    });
  };

  // Search handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = principals.filter((principal) =>
      principal.name.toLowerCase().includes(query) || principal.school?.schoolName.toLowerCase().includes(query)
    );

    setFilteredPrincipals(filtered);
  };

  // Navigate to particular principal page
  const handleViewPrincipal = (principalId) => {
    navigate(`/super-admin/principal/${principalId}`);
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Principals</h1>

        <button
          onClick={() => navigate("/super-admin/add-principal")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md transition-all mt-4 md:mt-0"
        >
          <PlusCircle size={20} />
          Add Principal
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8">
        <div className="flex items-center bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-sm w-full">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search Principal by Name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full ml-3 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* PRINCIPALS LIST */}
      {loading ? (
        <p className="text-gray-500">Loading principals...</p>
      ) : filteredPrincipals.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <User size={50} className="mx-auto mb-4 text-gray-400" />
          <p>No principals found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">

          {filteredPrincipals.map((principal) => (
            <div
              key={principal._id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-all"
            >
              
              {/* Principal Info */}
              <div className="cursor-pointer" onClick={() => handleViewPrincipal(principal._id)}>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User size={22} className="text-indigo-600" />
                  {principal.name}
                </h2>
                <p className="text-gray-600 mt-1">{principal.email}</p>
                {/* School info */}
                <p className="text-gray-700 flex items-center gap-2 mt-2">
                  <School size={18} className="text-indigo-500" />
                  {principal?.school?.schoolName || "Not Assigned"}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleViewPrincipal(principal._id)}
                  className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all"
                >
                  <Eye size={18} />
                  View
                </button>

                {
                  principal.status === "Active" ?
                  <button
                    onClick={()=>deactivatePrincipal(principal._id)}
                    className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={18} />
                    Deactivate
                  </button> :
                  <button
                    onClick={()=>activatePrincipal(principal._id)}
                    className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    <RefreshCcw size={18} />
                    Activate
                  </button>
                }
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export {ManagePrincipals};
