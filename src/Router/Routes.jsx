import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";
export default function RouterProvider() {
  const { authuser } = AuthContext();
  const Login = React.lazy(() => import("../pages/Login"));
  const Register = React.lazy(() => import("../pages/Register"));
  const Error = React.lazy(() => import("../pages/Error"));
  const Home = React.lazy(() => import("../pages/Home"));
  const UpdateProfile = React.lazy(() => import("../pages/UpdateProfile"));
  const CompleteProfile = React.lazy(
    () => import("../components/CompleteProfile"),
  );
  const IsVerified = React.lazy(() => import("../components/VerifyEmail"));

  return (
    <>
      <React.Suspense fallback={<>loading...</>}>
        <Routes>
          <Route
            path="/"
            element={authuser ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/home"
            element={
              authuser ? (
                <IsVerified>
                  <CompleteProfile>
                    <Home />
                  </CompleteProfile>
                </IsVerified>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={authuser ? <Navigate to="/home" /> : <Register />}
          />
          <Route
            path="/updateProfile"
            element={authuser ? <UpdateProfile /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </React.Suspense>
    </>
  );
}
