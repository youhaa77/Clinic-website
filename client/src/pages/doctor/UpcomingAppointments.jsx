import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";

function UpcomingAppointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [upcomingApp, setUpcomingApp] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/doctor/futureAppointmentPatients/6526653e47c45e179aa6886b")
      .then((response) => {
        setData(response.data);
        setLoading(false);
        setUpcomingApp(response.data.length > 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  function handleView(id) {
    navigate(`/viewHealth/${id}`);
  }

  const handleBack = () => {
    navigate("/viewMyPatients");
  };

  function handleAddHealthRecord(id) {
    navigate(`/AddHealthRecords/${id}`);
  }

  function handleUpcomingPatientAppointment(patientId) {
    navigate(`/PatientUpcomingAppointments/${patientId}`);
  }

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
        <div className="card m-3 col-12" style={{ width: "80%", borderRadius: "20px", left: "8%" }}>
          <div className="card-header">
            <h2>Patients you have an upcoming appointment with</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.date}</td>
                      <td>
                        <button
                          className="btn btn-primary rounded-2"
                          onClick={() => handleView(item._id)}
                        >
                          View Health records
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary rounded-2"
                          onClick={() => handleAddHealthRecord(item._id)}
                        >
                          Add health record
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary rounded-2"
                          onClick={() => handleUpcomingPatientAppointment(item._id)}
                        >
                          Upcoming details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {!upcomingApp && (
                  <tfoot>
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        <p style={{ color: "red" }}>No upcoming Appointments.</p>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}
          </div>
        </div>
        <button
          className="btn btn-primary rounded-2"
          style={{
            position: "absolute",
            bottom: "1%",
            right: "5%",
            width: "5%",
            height: "40px",
          }}
          onClick={handleBack}
        >
          Back
        </button>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default UpcomingAppointments;
