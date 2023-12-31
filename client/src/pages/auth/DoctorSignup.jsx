import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarHome";
import BottomBar from "../../components/BottomBar";

function DoctorSignup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [birthDate, setBrithDate] = useState();
  const [hospital, setHospital] = useState();
  const [hourlyRate, setHourlyRate] = useState();
  const [speciality, setSpec] = useState();
  const [idFile, setIdFile] = useState();
  const [degreeFile, setDegreeFile] = useState();
  const [licenseFile, setLicenseFile] = useState();

  const [eduBackground, setEduBackground] = useState();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    console.log(email);
    axios
      .post(
        " http://localhost:8000/doctor",
        {
          name,
          username,
          email,
          type: "Doctor",
          password,
          birthDate,
          hospital,
          speciality,
          hourlyRate,
          eduBackground,
          status: "Pending",
          idFile,
          degreeFile,
          licenseFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((err) => console.log(err));
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
          <h2>Doctor Register</h2>
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
                className="form-control rounded-0"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                name="email"
                className="form-control rounded-0"
                onChange={(e) => setName(e.target.value)}
              />
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
                className="form-control rounded-0"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
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

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Birth Date</strong>
              </label>
              <input
                type="Date"
                placeholder="Enter Birth Date"
                autoComplete="off"
                name="birthDate"
                className="form-control rounded-0"
                onChange={(e) => setBrithDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Hospital Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Hospital Name"
                autoComplete="off"
                name="hospital"
                className="form-control rounded-0"
                onChange={(e) => setHospital(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong> Speciality</strong>
              </label>
              <input
                type="text"
                placeholder="Enter your speciality"
                autoComplete="off"
                name="speciality"
                className="form-control rounded-0"
                onChange={(e) => setSpec(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Hourly Rate</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Hour Rate"
                autoComplete="off"
                name="hourlyRate"
                className="form-control rounded-0"
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Education Background</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Education Background"
                autoComplete="off"
                name="eduBackground"
                className="form-control rounded-0"
                onChange={(e) => setEduBackground(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nationalId">
                <strong>National Id</strong>
              </label>
              <input
                type="file"
                name="nationalId"
                className="form-control rounded-0"
                onChange={(e) => setIdFile(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="degree">
                <strong>Degree</strong>
              </label>
              <input
                type="file"
                name="degree"
                className="form-control rounded-0"
                onChange={(e) => setDegreeFile(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="license">
                <strong>License</strong>
              </label>
              <input
                type="file"
                name="license"
                className="form-control rounded-0"
                onChange={(e) => setLicenseFile(e.target.files[0])}
              />
            </div>
            <button
              style={{ marginTop: "10px" }}
              type="submit"
              className="btn btn-success w-100 rounded-0"
            >
              Register
            </button>
          </form>
          <br />
          <Link
            to="/"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration"
          >
            Login
          </Link>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default DoctorSignup;
