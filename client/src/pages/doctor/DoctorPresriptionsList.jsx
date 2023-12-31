import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

function DoctorPrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = `http://localhost:8000/doctor/prescriptions`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response);
        setPrescriptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, [id]);

  const handleBack = () => {
    navigate("/viewMyPatients");
  };

  const handleAddPrescription = () => {
    navigate(`/AddPrescription/${id}`);
  };

  const handleViewDetails = (presId) => {
    navigate(`/prescriptionDetails/${id}/${presId}`);
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
            <h2>Patient Prescriptions</h2>
            <button className="btn btn-primary" onClick={handleAddPrescription}>
              Add Prescription
            </button>
          </div>
          <div className="card-body">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prescriptions &&
                  prescriptions.length > 0 &&
                  prescriptions.map((prescription, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(prescription.date).toLocaleDateString(
                          "en-GB",
                          {}
                        )}
                      </td>
                      <td>{prescription.status}</td>
                      <td>
                        <IconButton
                          onClick={() => handleViewDetails(prescription._id)}
                        >
                          <VisibilityIcon></VisibilityIcon>
                        </IconButton>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
        </div>
      </AppBar>
    </div>
  );
}
export default DoctorPrescriptionsList;
