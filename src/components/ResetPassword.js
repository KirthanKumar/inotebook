import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = (props) => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const host = "https://inotebook-fpt7.onrender.com";

  const resetPassword = async () => {
    try {
      const response = await fetch(
        `${host}/api/fpauth/resetpassword/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        props.showAlert(json.message, "success");
        navigate("/login");
      } else {
        props.showAlert(json.error, "danger");
      }
    } catch (error) {
      console.error(error.message);
      props.showAlert("Server error", "danger");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      props.showAlert("Passwords do not match", "danger");
      return;
    }

    resetPassword();
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
