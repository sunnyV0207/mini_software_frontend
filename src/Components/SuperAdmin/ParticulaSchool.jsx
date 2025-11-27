// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   User,
//   School as SchoolIcon,
//   Mail,
//   Phone,
//   Edit,
//   RefreshCcw,
//   Ban,
//   KeyRound,
//   GraduationCap,
//   Users,
//   BookOpen,
//   UserPlus,
// } from "lucide-react";
// import Swal from "sweetalert2";

// export const ParticularSchool = () => {
//   const { schoolCode } = useParams();
//   const navigate = useNavigate();
//   const [school, setSchool] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchSchoolDetails = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
//       );
//       setSchool(res.data.data.school);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching school details:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchoolDetails();
//   }, []);

//   const deactivateSchool = (schoolId) => {

//     Swal.fire({
//         title: "Deactivate School",
//         text: "Are you sure you want to deactivate this school? You can reactivate it later.",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Deactivate",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#4F46E5",  // Indigo
//         cancelButtonColor: "#6B7280"    // Gray
//     }).then(async(result) => {
//     if (result.isConfirmed) {
//         try {
//           await axios.patch(
//             `${import.meta.env.VITE_BACKEND_URL}/api/school/update-school-status/${schoolId}`
//           );
//           setSchool((prevSchool) => ({
//             ...prevSchool,
//             status: prevSchool.status === "Inactive"
//           }));
//         } catch (error) {
//           console.error("Error deactivating school:", error);
//         }
//     }
//     }); 
//   };

//   const renewSchool = (schoolId) => {
//     Swal.fire({
//         title: "Renew School",
//         text: "Are you sure you want to renew this school?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Renew",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#4F46E5",  // Indigo
//         cancelButtonColor: "#6B7280"    // Gray
//     }).then(async (result) => {
//     if (result.isConfirmed) {
//         try {
//           await axios.patch(
//             `${import.meta.env.VITE_BACKEND_URL}/api/school/update-school-status/${schoolId}`
//           );
//           setSchool((prevSchool) => ({
//             ...prevSchool,
//             status: "Active"
//           }));
//         } catch (error) {
//           console.error("Error renewing school:", error);
//         }
//     }
//     }); 
//   };

//   if (loading)
//     return (
//       <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
//         Loading school...
//       </div>
//     );

//   if (!school)
//     return (
//       <div className="text-center py-10 text-red-500 text-sm sm:text-base">
//         Unable to load school data.
//       </div>
//     );

//   return (
//     <div className="p-4 sm:p-6 animate-fadeIn">
//       <div className="max-w-5xl mx-auto space-y-8">

//         {/* SCHOOL CARD */}
//         <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
//             <SchoolIcon size={20} className="text-indigo-600" /> School Details
//           </h2>
//           <div className="space-y-2 text-gray-700 mb-4 text-sm sm:text-base">
//             <p><strong>Name:</strong> {school.schoolName}</p>
//             <p><strong>School Code:</strong> {school.schoolCode}</p>
//             <p><strong>Contact:</strong> {school.contactNumber || "N/A"}</p>
//             <p><strong>Address:</strong> {school.address || "N/A"}</p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 w-full">
//             <button
//               onClick={() => navigate(`/super-admin/school/${school.schoolCode}/edit`)}
//               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
//             >
//               <Edit size={18} /> Edit
//             </button>

//             {
//               school.status === 'Active' ?
//               (
//                 <button
//                   onClick={()=>deactivateSchool(school._id)}
//                   className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
//                 >
//                   <Ban size={18} /> Deactivate
//                 </button>
//               ) : 
//               (
//                 <button
//                   onClick={()=>renewSchool(school._id)}
//                   className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
//                 >
//                   <RefreshCcw size={18} /> Renew
//                 </button>
//               )
//             }

//             <button
//               onClick={() => navigate(`/super-admin/school/${school.schoolCode}/re-assign-principal`)}
//               className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
//             >
//               <UserPlus size={18} /> New Principal
//             </button>
//           </div>
//         </div>

//         {/* PRINCIPAL CARD */}
//         <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
//             <User size={20} className="text-indigo-600" /> Principal Details
//           </h2>

//           {school.principal ? (
//             <>
//               <div className="space-y-2 text-gray-700 mb-4 text-sm sm:text-base">
//                 <p><strong>Name:</strong> {school.principal.name}</p>
//                 <p className="flex items-center gap-2"><Mail size={18} /> {school.principal.email}</p>
//                 <p className="flex items-center gap-2"><Phone size={18} /> {school.principal.phone || "N/A"}</p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button
//                   onClick={() => navigate(`/super-admin/school/${school.schoolCode}/edit-principal`)}
//                   className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
//                 >
//                   <Edit size={18} /> Edit
//                 </button>

//                 <button
//                   onClick={() => navigate(`/super-admin/school/${school.schoolCode}/principal/reset-password`)}
//                   className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
//                 >
//                   <KeyRound size={18} /> Reset Password
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-gray-500 italic text-sm sm:text-base">No principal assigned yet.</div>
//           )}
//         </div>

//         {/* STATISTICS GRID */}
//         <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">School Statistics</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

//             <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//               <GraduationCap size={28} className="mx-auto text-indigo-600 mb-2" />
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.teacherCount || 0}</h3>
//               <p className="text-gray-500 text-sm">Teachers</p>
//             </div>

//             <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//               <Users size={28} className="mx-auto text-indigo-600 mb-2" />
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.studentCount || 0}</h3>
//               <p className="text-gray-500 text-sm">Students</p>
//             </div>

//             <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//               <User size={28} className="mx-auto text-indigo-600 mb-2" />
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.parentCount || 0}</h3>
//               <p className="text-gray-500 text-sm">Parents</p>
//             </div>

//             <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//               <BookOpen size={28} className="mx-auto text-indigo-600 mb-2" />
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.classCount || 0}</h3>
//               <p className="text-gray-500 text-sm">Classes</p>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// /* Responsive version to be added here */


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
  ShieldCheck
} from "lucide-react";

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

        {/* RIGHT: Assigned School */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Assigned Principal
          </h2>

          {school.principal ? (
            <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                <School size={22} />
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
              No Principal assigned yet.
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

        <button
          onClick={() => alert("Delete logic coming soon!")}
          className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 shadow"
        >
          <Trash2 size={20} />
          Remove School
        </button>

      </div>
    </div>
  );
};

export {ParticularSchool};
