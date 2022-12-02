import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ screen: Component, ...restOfProps }) {
  const isAuthenticated = useSelector((state) => state.auth.status);
  console.log("this", isAuthenticated);

  return (
    isAuthenticated ? <Component {...restOfProps} /> : <Navigate replace to="/" />
  );
}

export default ProtectedRoute;