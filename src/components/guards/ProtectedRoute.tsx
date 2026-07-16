import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = "/auth/login",
}) => {
  const { token, user, isAuthenticated } = useAppSelector(
    (state: any) => state.auth
  );

  // Check if authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based authorization if allowedRoles are specified
  // if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/" replace />;
  // }

  // Render children subroutes
  return <Outlet />;
};

export default ProtectedRoute;
