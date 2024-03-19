import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AuthProvider from "../context/AuthProvider";
import ErrorPage from "../pages/ErrorPage";
import SignUp from "../pages/SignUp";
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Home />,
            path: "/",
          },
        ],
      },
    ],
  },
  {
    element: <SignUp />,
    path: "/signUp",
  },
]);
