import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({}); // State to hold errors from the API
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear old errors on a new submission

    if (password !== password2) {
      setErrors({ password2: ["Passwords do not match!"] });
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
        // Handle generic errors if the API doesn't send a specific message
        setErrors({ general: ["An unknown error occurred."] });
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleRegistration} noValidate>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.first_name && (
            <p style={{ color: "red" }}>{errors.first_name[0]}</p>
          )}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.last_name && (
            <p style={{ color: "red" }}>{errors.last_name[0]}</p>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email[0]}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password[0]}</p>
          )}
          {errors.password1 && (
            <p style={{ color: "red" }}>{errors.password1[0]}</p>
          )}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          {errors.password2 && (
            <p style={{ color: "red" }}>{errors.password2[0]}</p>
          )}
        </div>

        {errors.general && <p style={{ color: "red" }}>{errors.general[0]}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default RegisterPage;
