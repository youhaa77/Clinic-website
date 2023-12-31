import { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarHome";
import BottomBar from "../../components/BottomBar";
import axios from "axios";

function PatientSignup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [birthDate, setBrithDate] = useState();
  const [gender, setGender] = useState();
  const [phone, setPhone] = useState();
  const [emergencyName, setEmergencyName] = useState();
  const [emergencyNo, setEmergencyNo] = useState();
  const [emergencyRel, setEmergencyRel] = useState();
  const [adresses, setAdresses] = useState();
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post("http://localhost:8000/patient", {
        name,
        username,
        email,
        password,
        birthDate,
        gender,
        type: "Patient",
        phone,
        emergencyName,
        emergencyNo,
        emergencyRel,
        adresses,
        status: "Accepted",
      })
      .then((result) => {
        setRegistrationSuccess(true);
        setErrorMessage(""); 
        setUsernameError("");
        setShowUsernameError(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setRegistrationSuccess(false);
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
          // setErrorMessage(err.response.data.message);
          // setError(err.response.data.message); // Set form-level error
          // console.log('err.response.data.message',err.response.data.message)
          // if (err.response.data.message.toLowerCase().trim()==="username already exist") {
          //   setUsernameError(err.response.data.message);
          //   setShowUsernameError(true);
          // } else{
          //   setShowUsernameError(false);
          // }
        } else if (err.response && err.response.data) {
          alert(err.response.data);
          // setError(err.response.data);
        }
      })
      
    };
  
  const inputStyle = (fieldName) => ({
    border: `1px solid ${error && !eval(fieldName) ? 'red' : '#ced4da'}`,
  });
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
          <h2>Patient Register</h2>
          {registrationSuccess && (
          <div className="alert alert-success" role="alert">
            You have successfully registered!
          </div>
        )}
       
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Username</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                autoComplete="off"
                name="username"
                required
                className="form-control rounded-0"
                style={inputStyle("username")}
                onChange={(e) => {
                  setUsername(e.target.value);
                  handleInputChange(); 
                }}
              />
             {/* Display general form-level error */}
             {error && !username && (
              <div style={{ color: "red" }}>{usernameError ||"Please fill in the username."}</div>
            )}
</div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                name="name"
                required
                className="form-control rounded-0"
                style={inputStyle("name")}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleInputChange(); 
                  }}
              />
               {error && !name && (
              <div style={{ color: "red" }}>Please fill in the name.</div>
            )}
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                required
                className="form-control rounded-0"
                style={inputStyle("email")}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange(); 
                }}
              />
                 {error && !email && (
              <div style={{ color: "red" }}>Please fill in the email.</div>
            )}
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                pattern="(?=.*[A-Z])(?=.*\d).{8,}" 
                title="Password must contain at least one uppercase letter, one digit, and be at least 8 characters long."
                required
                className="form-control rounded-0"
                style={inputStyle("password")}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange(); 
                }}
              />
              {error && !password && (
              <div style={{ color: "red" }}>Please fill in the password.</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Birth Date</strong>
              </label>
              <input
                type="Date"
                placeholder="Enter Birth Date"
                autoComplete="off"
                name="birthDate"
                required
                className="form-control rounded-0"
                style={inputStyle("birthDate")}
                  onChange={(e) => {
                    setBrithDate(e.target.value);
                    handleInputChange(); 
                  }}
              />
                {error && !birthDate && (
              <div style={{ color: "red" }}>Please fill in the birthDate.</div>
            )}
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Gender</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Gender"
                autoComplete="off"
                name="gender"
                required
                className="form-control rounded-0"
                style={inputStyle("gender")}
                onChange={(e) => {
                  setGender(e.target.value);
                  handleInputChange(); 
                }}
              />
                 {error && !gender && (
              <div style={{ color: "red" }}>Please fill in the gender.</div>
            )}
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Phone Number</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                autoComplete="off"
                name="phone"
                required
                className="form-control rounded-0"
                style={inputStyle("phone")}
                onChange={(e) => {
                  setPhone(e.target.value);
                  handleInputChange(); 
                }}
              />
                {error && !phone && (
              <div style={{ color: "red" }}>Please fill in the phone.</div>
            )}
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Emergency Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Emergency Name"
                autoComplete="off"
                name="emergencyName"
                required
                className="form-control rounded-0"
                style={inputStyle("emergencyName")}
                onChange={(e) => {
                  setEmergencyName(e.target.value);
                  handleInputChange(); 
                }}
              />
               {error && !emergencyName && (
              <div style={{ color: "red" }}>Please fill in the emergencyName.</div>
            )}
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Emergency Phone Number</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Emergency Phone Number"
                autoComplete="off"
                name="emergencyNo"
                required
                className="form-control rounded-0"
                style={inputStyle("emergencyNo")}
                  onChange={(e) => {
                    setEmergencyNo(e.target.value);
                    handleInputChange(); 
                  }}
              />
                 {error && !emergencyNo && (
              <div style={{ color: "red" }}>Please fill in the emergencyNo.</div>
            )}
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Emergency Relation</strong>
              </label>
              <input
                type="text"
                placeholder="EnterEmergency Relation"
                autoComplete="off"
                name="emergencyRel"
                required
                className="form-control rounded-0"
                style={inputStyle("emergencyRel")}
                  onChange={(e) => {
                    setEmergencyRel(e.target.value);
                    handleInputChange(); 
                  }}
              />
                  {error && !emergencyRel && (
              <div style={{ color: "red" }}>Please fill in the emergencyRel.</div>
            )}
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong> Address</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Address"
                autoComplete="off"
                name="address"
                required
                className="form-control rounded-0"
                style={inputStyle(adresses)}
            onChange={(e) => setAdresses(e.target.value)}
          />
               {error && !adresses && (
            <div style={{ color: "red" }}>Please fill in the address.</div>
          )}
            </div>
            {registrationSuccess && (
            <div className="alert alert-success" role="alert">
              You have successfully registered!
            </div>
          )}
          
            <div>
            <button
                style={{ marginTop: "10px" }}
                type="submit"
                className="btn btn-primary w-10 rounded-2"
              >
                Register
              </button>
              </div>
              <div>
              {error && <div style={{ color: "red" }}>{error}</div>}
          </div>
          
          </form>
          {showUsernameError && (
  <div style={{ color: "red", marginBottom: "10px" }}>
    {usernameError}
  </div>
)}
          <button className="btn btn-primary rounded-2"
              style={{
                position: 'absolute',
                bottom: '1%',
                right: '5%',
                width: '5%',
                height: '40px',
              }}
              
              onClick={handleBack}
            >
              Back
            </button>
      
         
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default PatientSignup;
