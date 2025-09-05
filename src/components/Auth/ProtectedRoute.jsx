/*
  ProtectedRoute Component
  - Protects routes that require authentication
  - Redirects to login if user is not authenticated
  - Shows loading state while checking authentication
*/

import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
