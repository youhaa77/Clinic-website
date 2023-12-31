import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";

function UpcomingAppointmentDetails() {
  const [appointments, setAppointments] = useState([]);
  const { patientID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = `http://localhost:8000/appointment/getPatientAppointments`;
    axios
      .get(apiUrl)
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, [patientID]);

  const handleBack = () => {
    navigate("/viewMyPatients");
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
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          <div className="card-header">
            <h2>my patient appointments</h2>
          </div>
          <div className="card-body">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.patientId.name}</td>
                    <td>{appointment.patientId.email}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.status}</td>
                    <td>{appointment.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
export default UpcomingAppointmentDetails;
