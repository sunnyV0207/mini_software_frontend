// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
// User,
// School as SchoolIcon,
// Mail,
// Phone,
// Edit,
// RefreshCcw,
// Ban,
// KeyRound,
// GraduationCap,
// Users,
// BookOpen,
// UserPlus,
// } from "lucide-react";

// const ParticularSchool = () => {
// const { schoolCode } = useParams();
// const navigate = useNavigate();
// const [school, setSchool] = useState(null);
// const [loading, setLoading] = useState(true);

// const fetchSchoolDetails = async () => {
// try {
// const res = await axios.get(
// `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
// );
// setSchool(res.data.data.school);
// setLoading(false);
// } catch (error) {
// console.error("Error fetching school details:", error);
// setLoading(false);
// }
// };

// useEffect(() => {
// fetchSchoolDetails();
// }, []);

// if (loading)
// return <div className="text-center py-10 text-gray-600">Loading school...</div>;

// if (!school)
// return ( <div className="text-center py-10 text-red-500">
// Unable to load school data. </div>
// );

// return ( <div className="p-6 animate-fadeIn"> <div className="max-w-5xl mx-auto space-y-8">
//     {/* SCHOOL CARD */}
//     <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
//         <SchoolIcon size={20} className="text-indigo-600" /> School Details
//       </h2>
//       <div className="space-y-2 text-gray-700 mb-4">
//         <p><strong>Name:</strong> {school.schoolName}</p>
//         <p><strong>School Code:</strong> {school.schoolCode}</p>
//         <p><strong>Contact:</strong> {school.contactNumber || "N/A"}</p>
//         <p><strong>Address:</strong> {school.address || "N/A"}</p>
//       </div>
//       <div className="flex gap-3">
//         <button onClick={()=>navigate(`/super-admin/school/${school.schoolCode}/edit`)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all">
//           <Edit size={18} /> Edit
//         </button>
//         <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all">
//           <Ban size={18} /> Deactivate
//         </button>
//         <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all">
//           <RefreshCcw size={18} /> Renew
//         </button>
//         <button onClick={()=>navigate(`/super-admin/school/${school.schoolCode}/re-assign-principal`)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all">
//           <UserPlus size={18} /> New Principal
//         </button>
//       </div>
//     </div>

//     {/* PRINCIPAL CARD */}
//     <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
//         <User size={20} className="text-indigo-600" /> Principal Details
//       </h2>
//       {school.principal ? (
//         <>
//           <div className="space-y-2 text-gray-700 mb-4">
//             <p><strong>Name:</strong> {school.principal.name}</p>
//             <p className="flex items-center gap-2">
//               <Mail size={18} /> {school.principal.email}
//             </p>
//             <p className="flex items-center gap-2">
//               <Phone size={18} /> {school.principal.phone || "N/A"}
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={()=>navigate(`/super-admin/school/${school.schoolCode}/edit-principal`)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all">
//               <Edit size={18} /> Edit
//             </button>
//             <button onClick={()=>navigate(`/super-admin/school/${school.schoolCode}/principal/reset-password`)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition-all">
//               <KeyRound size={18} /> Reset Password
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="text-gray-500 italic">No principal assigned yet.</div>
//       )}
//     </div>

//     {/* STATISTICS GRID */}
//     <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">School Statistics</h2>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//           <GraduationCap size={28} className="mx-auto text-indigo-600 mb-2" />
//           <h3 className="text-xl font-semibold text-gray-800">{school.teacherCount || 0}</h3>
//           <p className="text-gray-500">Teachers</p>
//         </div>
//         <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//           <Users size={28} className="mx-auto text-indigo-600 mb-2" />
//           <h3 className="text-xl font-semibold text-gray-800">{school.studentCount || 0}</h3>
//           <p className="text-gray-500">Students</p>
//         </div>
//         <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//           <User size={28} className="mx-auto text-indigo-600 mb-2" />
//           <h3 className="text-xl font-semibold text-gray-800">{school.parentCount || 0}</h3>
//           <p className="text-gray-500">Parents</p>
//         </div>
//         <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
//           <BookOpen size={28} className="mx-auto text-indigo-600 mb-2" />
//           <h3 className="text-xl font-semibold text-gray-800">{school.classCount || 0}</h3>
//           <p className="text-gray-500">Classes</p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// );
// };

// export { ParticularSchool };



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  School as SchoolIcon,
  Mail,
  Phone,
  Edit,
  RefreshCcw,
  Ban,
  KeyRound,
  GraduationCap,
  Users,
  BookOpen,
  UserPlus,
} from "lucide-react";

export const ParticularSchool = () => {
  const { schoolCode } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchoolDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}`
      );
      setSchool(res.data.data.school);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching school details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
        Loading school...
      </div>
    );

  if (!school)
    return (
      <div className="text-center py-10 text-red-500 text-sm sm:text-base">
        Unable to load school data.
      </div>
    );

  return (
    <div className="p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* SCHOOL CARD */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <SchoolIcon size={20} className="text-indigo-600" /> School Details
          </h2>
          <div className="space-y-2 text-gray-700 mb-4 text-sm sm:text-base">
            <p><strong>Name:</strong> {school.schoolName}</p>
            <p><strong>School Code:</strong> {school.schoolCode}</p>
            <p><strong>Contact:</strong> {school.contactNumber || "N/A"}</p>
            <p><strong>Address:</strong> {school.address || "N/A"}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate(`/super-admin/school/${school.schoolCode}/edit`)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
            >
              <Edit size={18} /> Edit
            </button>

            <button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
            >
              <Ban size={18} /> Deactivate
            </button>

            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
            >
              <RefreshCcw size={18} /> Renew
            </button>

            <button
              onClick={() => navigate(`/super-admin/school/${school.schoolCode}/re-assign-principal`)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
            >
              <UserPlus size={18} /> New Principal
            </button>
          </div>
        </div>

        {/* PRINCIPAL CARD */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <User size={20} className="text-indigo-600" /> Principal Details
          </h2>

          {school.principal ? (
            <>
              <div className="space-y-2 text-gray-700 mb-4 text-sm sm:text-base">
                <p><strong>Name:</strong> {school.principal.name}</p>
                <p className="flex items-center gap-2"><Mail size={18} /> {school.principal.email}</p>
                <p className="flex items-center gap-2"><Phone size={18} /> {school.principal.phone || "N/A"}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/super-admin/school/${school.schoolCode}/edit-principal`)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
                >
                  <Edit size={18} /> Edit
                </button>

                <button
                  onClick={() => navigate(`/super-admin/school/${school.schoolCode}/principal/reset-password`)}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition-all justify-center w-full sm:w-auto text-sm"
                >
                  <KeyRound size={18} /> Reset Password
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic text-sm sm:text-base">No principal assigned yet.</div>
          )}
        </div>

        {/* STATISTICS GRID */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">School Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
              <GraduationCap size={28} className="mx-auto text-indigo-600 mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.teacherCount || 0}</h3>
              <p className="text-gray-500 text-sm">Teachers</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
              <Users size={28} className="mx-auto text-indigo-600 mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.studentCount || 0}</h3>
              <p className="text-gray-500 text-sm">Students</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
              <User size={28} className="mx-auto text-indigo-600 mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.parentCount || 0}</h3>
              <p className="text-gray-500 text-sm">Parents</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center shadow-sm">
              <BookOpen size={28} className="mx-auto text-indigo-600 mb-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{school.classCount || 0}</h3>
              <p className="text-gray-500 text-sm">Classes</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

/* Responsive version to be added here */