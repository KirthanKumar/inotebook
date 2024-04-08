import "./App.css";
import { BrowserRouter as Router, Routes, Route, HashRouter, HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import AddNote from "./components/AddNote";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ConfirmLogin from "./components/ConfirmLogin";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
      <NoteState>
        <HashRouter>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />} />
              <Route exact path="/about" element={<About />} />
              <Route
                exact
                path="/login"
                element={<Login showAlert={showAlert} />}
              />
              <Route
                exact
                path="/signup"
                element={<Signup showAlert={showAlert} />}
              />
              <Route
                exact
                path="/addnote"
                element={<AddNote showAlert={showAlert} />}
              />
              <Route
                exact
                path="/forgotpassword"
                element={<ForgotPassword showAlert={showAlert} />}
              />
              <Route
                path="/resetpassword/:token"
                element={<ResetPassword showAlert={showAlert} />}
              />
              <Route
                path="/resetpassword/:token"
                element={<ResetPassword showAlert={showAlert} />}
              />
              <Route
                path="/confirmLogin"
                element={<ConfirmLogin showAlert={showAlert} />}
              />
            </Routes>
          </div>
        </HaRouter>
      </NoteState>
    </>
  );
}

export default App;
