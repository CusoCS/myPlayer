import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "../components/RegisterPage.module.css";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (password !== password2) {
      setErrors({ password2: ["Passwords do not match!"] });
      setIsLoading(false);
      return;
    }

    const payload = {
      username: email,
      email: email,
      first_name: firstName,
      last_name: lastName,
      password1: password,
      password2: password2,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/registration/`,
        payload
      );

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Registration failed!", error.response.data);
        setErrors(error.response.data);
      } else {
        setErrors({ general: ["An unknown error occurred."] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <div className={styles.icon}>🎼</div>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Join the music community</p>
        </div>

        <form onSubmit={handleRegistration} noValidate className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your first name"
            />
            {errors.first_name && (
              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.first_name[0]}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your last name"
            />
            {errors.last_name && (
              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.last_name[0]}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.email[0]}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Create a password"
            />
            {errors.password && (
              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.password[0]}
              </p>
            )}
            {errors.password1 && (
              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.password1[0]}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className={styles.input}
              placeholder="Confirm your password"
            />
            {errors.password2 && (
              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.password2[0]}
              </p>
            )}
          </div>

          {errors.general && (
            <p
              style={{
                color: "var(--error-color)",
                fontSize: "0.85rem",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {errors.general[0]}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.loginLink}>
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
