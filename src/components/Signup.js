import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avataars from "../images/avataaars.png";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    otp: "",
  });

  let navigate = useNavigate();

  const handleSendOTP = async (e) => {
    // e.preventDefault();
    if (credentials.password !== credentials.cpassword) {
      props.showAlert("Password did not match", "danger");
      return;
    }
    const response = await fetch("http://localhost:5000/api/sauth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);

    // if (json.success) {
    //   // save the auth token and redirect
    //   localStorage.setItem("token", json.authtoken);
    //   navigate("/");
    //   props.showAlert("Account Created Successfully", "success");

    // } else {
    //   props.showAlert("Invalid credentials", "danger");
    // }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/sauth/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name:credentials.name, 
        email: credentials.email,
        otp: credentials.otp,
        password:credentials.password
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/");
      props.showAlert("Account Created Successfully", "success");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-2 d-flex">
      <div className="col-md-5">
        <img
          className="img-fluid"
          src={avataars}
          alt="register"
          style={{ width: "100%", height: "80vh", objectFit: "cover" }}
        />
      </div>
      {/* <Link to={"/"} role="button" className="mx-5">
        <i className="fa-solid fa-arrow-left" style={{ color: "#74C0FC" }}>
          {" "}
          Home
        </i>
      </Link> */}
      <div className="col-md-7 ps-5 pe-5 pt-5" style={{ width: "50%" }}>
        <h2>Create an account to use iNotebook</h2>
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name *
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              aria-describedby="emailHelp"
              name="name"
              value={credentials.name}
              onChange={onChange}
            />
          </div>
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
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              className="form-control"
              id="cpassword"
              name="cpassword"
              value={credentials.cpassword}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <button
            // type="submit"
            className="btn btn-outline-primary"
            onClick={()=>{handleSendOTP()}}
          >
            Send OTP
          </button>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">
              Enter OTP *
            </label>
            <input
              type="text"
              className="form-control"
              id="otp"
              name="otp"
              value={credentials.otp}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-primary">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
