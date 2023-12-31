import { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarHome";
import BottomBar from "../../components/BottomBar";
import { useNavigate } from "react-router-dom";
function Patientlogin() {
  {
    const [name, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name && !password) {
        setError("Please fill in both username and password.");
        return;
      }
  
      if (!name) {
        setError("Please fill in the username.");
        return;
      }
  
      if (!password) {
        setError("Please fill in the password.");
        return;
      }
      //  console.log(email);
      axios
        .post(" http://localhost:8000/patient/patientLogin", {
          name,
          password,
        })
        .then((result) => {
          console.log(result.data.token);
          sessionStorage.setItem("token", JSON.stringify(result.data.token));

          const data = sessionStorage.getItem("token");
          console.log("asassaas " + data);
          window.location.pathname = "/homePage";
        })
        .catch((err) => {
          console.log(err.response.data); 
  
  
          const errorMessage = err.response?.data || "Incorrect username or password";
          setError(errorMessage);
        });
    };

    const inputStyle = {
      border: `1px solid ${error ? 'red' : '#ced4da'}`, 
    };
    const handleInputChange = () => {
     
      setError("");
    };

    const handleBack= () => {
      navigate("/");
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
            className="card m-3 col-12"
            style={{
              width: "80%",
              borderRadius: "20px",
              left: "8%",
              display: "flex",
            }}
          >
            <h2>Patient Login</h2>
            <form action="" onSubmit={handleSubmit}>
            <div className={`mb-3 ${error ? 'has-error' : ''}`}>
                <label htmlFor="email">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  autoComplete="off"
                  name="username"
                  className="form-control rounded-0"
                  style={inputStyle}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    handleInputChange(); 
                  }}
                />
              </div>
              <div className={`mb-3 ${error ? 'has-error' : ''}`}>
                <label htmlFor="email">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  className="form-control rounded-0"
                  style={inputStyle}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange(); 
                  }}
                />
                 {error && <div style={{ color: "red" }}>{error}</div>}
              </div>
              <a href="/ForgetPassword">ForgetPassword</a>
              <div>
              <button
                style={{ marginTop: "10px" }}
                type="submit"
                className="btn btn-primary w-10 rounded-2"
              >
                Login
              </button>
              </div>
              <button className="btn btn-primary rounded-2"
              style={{
                position: 'fixed',
                bottom: '5%',
                right: '5%',
                width: '5%',
                height: '40px',
              }}
              
              onClick={handleBack}
            >
              Back
            </button>
            </form>
          </div>
          <BottomBar />
        </AppBar>
      </div>
    );
  }
}

export default Patientlogin;
