import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDeleteAccount = async () => {
    // Prompt user to enter password
    const password = prompt("Enter your password to confirm account deletion:");
    if (password !== null) {
      try {
        // Send a request to the server to delete the account
        const response = await fetch(
          "http://localhost:5000/api/dauth/deleteAccount",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ password }),
          }
        );
        const json = await response.json();
        console.log(json);
        if (json.success) {
          alert("Account deleted successfully!");
          handleClose();
          navigate("/signup");
        } else {
          alert(
            "Failed to delete account. Please try again later. " + json.error
          );
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again later.");
      }
    }
  };

  return (
    <div>
      <button className="btn btn-outline-primary" onClick={handleShow}>
        <i className="bi bi-person"></i> My Profile
      </button>

      {showModal && (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">My Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                {/* Add profile details here */}
                <p>Name: {localStorage.getItem("name")}</p>
                <p>Email: {localStorage.getItem("email")}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
