import axios from "axios";
import { useState } from "react";
import { Card } from "../components/Card";
import { useNavigate } from "react-router-dom";
import "../scss/Login.scss";

export const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showLoginForm, setShowLoginForm] = useState(true);

  const { email, password } = loginData;

  const handleLoginInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.log("Login Failed", error);
    }
  };

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/addUser", user);
      console.log("User Added Successfully", res.data);
    } catch (error) {
      console.log("Error adding User", error);
    }
  };

  return (
    <div
      className={`container ${
        showLoginForm ? "show-login-form" : "show-signup-form"
      }`}
    >
      <Card className="card">
        <form
          onSubmit={showLoginForm ? handleLogin : handleSubmit}
          className={`form ${showLoginForm ? "login-form" : "signup-form"}`}
        >
          <h2 className="title">{showLoginForm ? "Login" : "Sign Up"}</h2>
          {showLoginForm && (
            <>
              <label className="form-label">
                Username:
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleLoginInputChange}
                  className="input-field"
                />
              </label>
              <label className="form-label">
                Password:
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleLoginInputChange}
                  className="input-field"
                />
              </label>
            </>
          )}

          {!showLoginForm && (
            <>
              <label className="form-label">
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label className="form-label">
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label className="form-label">
                Email:
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label className="form-label">
                Password:
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
            </>
          )}

          <button type="submit" className="submit-button">
            {showLoginForm ? "Login" : "Sign Up"}
          </button>
          <p>
            {showLoginForm
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span className="form-link" onClick={handleToggleForm}>
              {showLoginForm ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>
      </Card>
    </div>
  );
};
