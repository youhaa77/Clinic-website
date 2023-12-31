import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";

function FollowUPPending() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    axios
      .get(`http://localhost:8000/doctor/getFollowUpRequest`)
      .then((response) => {
        console.log("API Response:", response.data);
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);
  const handleAccept = async (appointment) => {
    let newStatus = "Accepted";
    try {
      const response =await axios.put(`http://localhost:8000/doctor/updatecompletedAppointment/${appointment.doctorId.name}`, {
        appointmentId: appointment._id,
        newStatus,
      });

      if (response.data) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((prevAppointment) =>
            prevAppointment._id === appointment._id
              ? { ...prevAppointment, status: newStatus }
              : prevAppointment
          )
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };
  const handleReject = async (appointment) => {
    let newStatus = "Rejected";
    try {
      const response =await axios.put(`http://localhost:8000/doctor/updatecancelledAppointment/${appointment.doctorId.name}`, {
        appointmentId: appointment._id,
        newStatus,
      });

      if (response.data) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((prevAppointment) =>
            prevAppointment._id === appointment._id
              ? { ...prevAppointment, status: newStatus }
              : prevAppointment
          )
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
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
            backgroundColor: " rgb(65, 105, 225)",
            borderRadius: "50px",
            margin: "10px",
            width: "40%",
            marginLeft: "30%",
          }}
        >
          <h1
            style={{
              font: "Arial",
              fontWeight: "bold",
              color: "white",
              margin: "10px",
            }}
          >
            Pending Follow Ups
          </h1>
        </div>
        <div
          className="card m-3 col-12"
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.patientId?.name}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.status}</td>
                        <td>{appointment.type}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            style={{ backgroundColor: 'darkGreen' }}

                            onClick={() => handleAccept(appointment)}
                          >
                            Accepted
                          </button>
                          <button
                            className="btn btn-success"
                            style={{ backgroundColor: 'darkRed', marginLeft: "5%" }}
                            onClick={() => handleReject(appointment)}
                          >
                            Revoked
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No appointments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default FollowUPPending;
