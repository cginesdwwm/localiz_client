// SPLASHSCREEN

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Splashscreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // If the user is already authenticated, land them on Homepage instead of the splash
      navigate("/homepage", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
