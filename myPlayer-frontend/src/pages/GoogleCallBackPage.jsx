import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const GoogleCallbackPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const effectRan = useRef(false);

  useEffect(() => {
    // In React's Strict Mode, this check prevents the logic from running twice.
    if (effectRan.current === true) {
      return;
    }

    // Mark that the effect has run.
    effectRan.current = true;

    const handleGoogleCallback = async () => {
      // Extract the authorization code from the URL query parameters
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        setError("Authentication failed: No authorization code found.");
        return;
      }

      try {
        const payload = { code };
        // Exchange the authorization code for tokens from the backend
        const response = await api.post("/api/auth/google/", payload);

        const { access, refresh, user } = response.data;

        // Defensive check: ensure the tokens exist before proceeding
        if (!access || !refresh) {
          throw new Error("Login failed: Invalid token response from server.");
        }

        // Use the login function from AuthContext to store tokens and set auth state
        login(access, refresh, user);
      } catch (err) {
        console.error("Google login failed!", err);
        const errorMessage =
          err.response?.data?.detail ||
          err.message ||
          "An unknown error occurred during login.";
        setError(errorMessage);
      }
    };

    handleGoogleCallback();
  }, [login, navigate]); // Dependencies for the useEffect hook

  // Render different UI based on the state (loading vs. error)
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Login Failed</h1>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/login")}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Finalizing your login...</h1>
      <p>Please wait a moment.</p>
    </div>
  );
};

export default GoogleCallbackPage;
