import React, { useState } from "react";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const host = "https://inotebook-fpt7.onrender.com";

  const receiveResetEmail = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${host}/api/fpauth/forgotpassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Changed here
        }),
      }
    );

    const json = await response.json();
    console.log(json);

    if (json.success) {
      props.showAlert("Sent email for resetting password", "success");
    } else {
      props.showAlert("Try again", "danger");
    }
  };

  const onChange = (e) => {
    setEmail(e.target.value); // Changed here
  };

  return (
    <div>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="email"
            value={email}
          />
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={receiveResetEmail} // Changed here
        >
          Receive Password Reset Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
