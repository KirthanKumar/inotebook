import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [togglePassword, setTogglePassword] = useState(true);
  const host = "https://inotebook-fpt7.onrender.com";

  let navigate = useNavigate();

  const passwordSeeAndUnsee = () => {
    if (togglePassword === true) {
      setTogglePassword(false);
    } else {
      setTogglePassword(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem("name", json.name);
      localStorage.setItem("email", json.email);
      navigate("/");
      props.showAlert("Logged In Successfully", "success");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Link to={"/"} role="button">
        <i className="fa-solid fa-arrow-left" style={{ color: "#74C0FC" }}>
          {" "}
          Home
        </i>
      </Link>
      <div className="container mt-2 addnotes">
        <h2>Login to continue using iNotebook</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address *
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type={togglePassword ? "password" : "text"}
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              onMouseDown={passwordSeeAndUnsee}
            />
          </div>
          <button type="submit" className="btn btn-outline-primary">
            Submit
          </button>
        </form>
        <p className="mt-3">
          Forgot password? <Link to="/forgotpassword">reset</Link>{" "}
        </p>
        <p className="mt-3">
          Don't have an account? <Link to="/signup">register</Link>{" "}
        </p>
      </div>
    </>
  );
};

export default Login;
