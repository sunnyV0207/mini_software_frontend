import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './Components/Home/Home.jsx';
import Login from './Components/Login/Login.jsx';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword.jsx';
import VerifyOtp from './Components/VerifyOtp/VerifyOtp.jsx';
import ResetPassword from './Components/ResetPassword/ResetPassword.jsx';
import { SuperAdminLayout } from './Components/SuperAdmin/SuperAdminLayout.jsx';
import { SuperAdminDashboard } from './Components/SuperAdmin/SuperAdminDashboard.jsx';
import { AddPrincipalForm } from './Components/SuperAdmin/AddPrincipal.jsx';
import { AddSchool } from './Components/SuperAdmin/AddSchool.jsx';
import { ManageSchools } from './Components/SuperAdmin/ManageSchools.jsx';
import { ManagePrincipals } from './Components/SuperAdmin/ManagePrincipals.jsx';
import { ParticularSchool } from './Components/SuperAdmin/ParticulaSchool.jsx';
import { ParticularPrincipal } from './Components/SuperAdmin/ParticularPrincipal.jsx';
import { EditSchool } from './Components/SuperAdmin/EditSchool.jsx';
import { EditPrincipal } from './Components/SuperAdmin/EditPrincipal.jsx';
import { ResetPassword as ResetPrincipalPassword } from './Components/SuperAdmin/ResetPassword.jsx';
import { ReassignPrincipal } from './Components/SuperAdmin/ReassignPrincipal.jsx';
import { SchoolLayout } from './Components/School/SchoolLayout.jsx';
import { SchoolDashboard } from './Components/School/SchoolDashboard.jsx';
import { AddClass } from './Components/School/AddClass.jsx';
import { AddTeacher } from './Components/School/AddTeacher.jsx';
import { ManageTeachers } from './Components/School/ManageTeachers.jsx';
import { EditTeacher } from './Components/School/EditTeacher.jsx';
import { ManageClasses } from './Components/School/ManageClasses.jsx';
import { EditClass } from './Components/School/EditClass.jsx';
import { AddStudent } from './Components/School/AddStudent.jsx';
import { ManageStudents } from './Components/School/ManageStudents.jsx';
import { EditStudent } from './Components/School/EditStudent.jsx';
import { AddParent } from './Components/School/AddParent.jsx';
import { ManageParents } from './Components/School/ManageParents.jsx';
import { EditParent } from './Components/School/EditParent.jsx';
import { TeacherLayout } from './Components/Teacher/TeacherLayout.jsx';
import { TeacherDashboard } from './Components/Teacher/TeacherDashboard.jsx';
import { MyClass } from './Components/Teacher/MyClass.jsx';
import { AttendanceRegister } from './Components/Teacher/AttendanceRegister.jsx';
import { MarksRegister } from './Components/Teacher/MarksRegister.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      },
      {
        path: 'super-admin',
        element: <SuperAdminLayout />,
        children: [
          {
            index: true,
            element: <SuperAdminDashboard />
          },
          {
            path: 'dashboard',
            element: <SuperAdminDashboard />
          },
          {
            path: 'add-principal',
            element: <AddPrincipalForm />
          },
          {
            path: 'add-school',
            element: <AddSchool />
          },
          {
            path: 'manage-schools',
            element: <ManageSchools />
          },
          {
            path: 'manage-principals',
            element: <ManagePrincipals />
          },
          {
            path: 'school/:schoolCode',
            element: <ParticularSchool />
          },
          {
            path: 'principal/:principalId',
            element: <ParticularPrincipal />
          },
          {
            path: 'school/:schoolCode/edit',
            element: <EditSchool />
          },
          {
            path: 'principal/:principalId/edit',
            element: <EditPrincipal />
          },
          {
            path: 'school/:schoolCode/principal/reset-password',
            element: <ResetPrincipalPassword />
          },
          {
            path: 'school/:schoolCode/re-assign-principal',
            element: <ReassignPrincipal />
          }
        ]
      },
      {
        path: "school",
        element: <SchoolLayout />,
        children: [
          {
            index: true,
            element: <SchoolDashboard />
          },
          {
            path: "dashboard",
            element: <SchoolDashboard />
          },
          {
            path: ":schoolCode/teachers",
            element: <ManageTeachers />
          },
          {
            path: ":schoolCode/students",
            element: <ManageStudents />
          },
          {
            path: ":schoolCode/parents",
            element: <ManageParents />
          },
          {
            path: ":schoolCode/parents/add",
            element: <AddParent />
          },
          {
            path: ":schoolCode/classes/add",
            element: <AddClass />
          },
          {
            path: ':schoolCode/teachers/add',
            element: <AddTeacher />
          },
          {
            path: ":schoolCode/students/add",
            element: <AddStudent />
          },
          {
            path: 'teacher/:teacherId/edit',
            element: <EditTeacher />
          },
          {
            path: 'student/:studentId/edit',
            element: <EditStudent />
          },
          {
            path: 'parent/:parentId/edit',
            element: <EditParent />
          },
          {
            path: 'class/:classId/edit',
            element: <EditClass />
          },
          {
            path: ':schoolCode/classes',
            element: <ManageClasses />
          }
        ]
      },
      {
        path: "teacher",
        element: <TeacherLayout />,
        children: [
          {
            index: true,
            element: <TeacherDashboard />
          },
          {
            path: "dashboard",
            element: <TeacherDashboard />
          },
          {
            path: "my-class",
            element: <MyClass />
          },
          {
            path: "attendance",
            element: <AttendanceRegister />
          },
          {
            path: "marks",
            element: <MarksRegister />
          },
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
