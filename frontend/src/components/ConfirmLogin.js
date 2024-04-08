import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmLogin = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const host = "https://inotebook-fpt7.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("trying");
      const response = await fetch(`${host}/api/confirmauth/confirm-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationCode }),
      });
      const json = await response.json();
      console.log(json);
      console.log(json.success);
      if (json.success) {
        // Redirect to home page on successful confirmation

        navigate("/login");
      } else {
        // Display error message if confirmation code is incorrect
        setError(json.error);
      }
    } catch (error) {
      console.error("Error during confirmation:", error);
      setError("An error occurred during confirmation.");
    }
  };

  return (
    <div>
      <h2>Confirm Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="confirmationCode" className="form-label">
            Confirmation Code
          </label>
          <input
            type="text"
            className="form-control"
            id="confirmationCode"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ConfirmLogin;
