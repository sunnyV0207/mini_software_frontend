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
import { SuperAdminDashboard } from './Components/SuperAdminDashboard/SuperAdminDashboard.jsx';

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
        path: 'super-admin/dashboard',
        element: <SuperAdminDashboard />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
