import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {RouterProvider, createBrowserRouter} from "react-router-dom";
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
import { ParticularSchool } from './Components/SuperAdmin/ParticulaSchool.jsx';
import { EditSchool } from './Components/SuperAdmin/EditSchool.jsx';
import { EditPrincipal } from './Components/SuperAdmin/EditPrincipal.jsx';
import { ResetPassword as ResetPrincipalPassword } from './Components/SuperAdmin/ResetPassword.jsx';
import { ReassignPrincipal } from './Components/SuperAdmin/ReassignPrincipal.jsx';

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
            path: 'school/:schoolCode',
            element: <ParticularSchool />
          },
          {
            path: 'school/:schoolCode/edit',
            element: <EditSchool />
          },
          {
            path: 'school/:schoolCode/edit-principal',
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
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
