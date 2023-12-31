import { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { Alert } from "@mui/material";
import ResponsiveAppBar from "../../components/TopBarAdmin";
import BottomBar from "../../components/BottomBar";

function AddAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const isFormValid = username && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/admin/addAdministrator", {
        username,
        password,
        type: "Admin",
      });

      console.log(response); // Corrected variable name from 'result' to 'response'

      setShowAlert(true);
      setAlertSeverity("success");
      setAlertMessage("Administrator Added Successfully");

      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 9000);
    } catch (error) {
      setShowAlert(true);
console.log("error.response.data.error",error.response.data.error)
if (error.response && error.response.data.error.toLowerCase().trim() === "username is already taken ,please choose a different username") {
  setAlertSeverity("error");
  setAlertMessage("Username is already taken, please choose a different username");
 
}

      setTimeout(() => {
        setShowAlert(false);
        setAlertSeverity("");
        setAlertMessage("");
      }, 9000);
    }
  };

  return (
    <div style={{ marginRight: "-5%", marginLeft: "-5%" }}>
      <AppBar
        style={{
          height: "100%",
          backgroundColor: "#F0F0F0",
          overflowY: "auto",
        }}
      >
        <ResponsiveAppBar />
        <div
          style={{
            backgroundColor: "rgb(65, 105, 225)",
            borderRadius: "50px",
            margin: "10px",
            width: "40%",
            marginLeft: "30%",
          }}
        >
          <h1
            style={{
              fontFamily: "Arial", // Changed 'font' to 'fontFamily'
              fontWeight: "bold",
              color: "white",
              margin: "10px",
            }}
          >
            Add Administrator
          </h1>
        </div>
        {showAlert && (
          <Alert
            style={{
              marginTop: "2%",
              fontSize: "18px",
              backgroundColor: alertSeverity === "success" ? "RGB(50, 205, 50)" : "red",
              width: "70%",
              marginLeft: "15%",
              textAlign: "center",
            }}
            variant="filled"
            onClose={() => {
              setShowAlert(false);
              setAlertSeverity("");
              setAlertMessage("");
            }}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}
        <div
          className="card m-3 col-12"
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username">
                <strong>Username</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                autoComplete="off"
                name="username"
                className="form-control rounded-0"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
              Add
            </button>
          </form>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default AddAdmin;
