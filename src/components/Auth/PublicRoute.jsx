/*
  PublicRoute Component
  - For routes like login/register that should redirect if already authenticated
  - Prevents authenticated users from seeing login forms
*/

import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    // Redirect authenticated users to homepage
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default PublicRoute;
