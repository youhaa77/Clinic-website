import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import axios from "axios";

function ViewDoctor() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = "http://localhost:8000/patient/docInfo/" + id;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    // Use the navigate function to go to the specified route
    navigate("/filter");
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
          <div className="card-header">
            <h2>Doctor Details</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                <li>name: {data.name}</li>
                <li>email: {data.email}</li>
                <li>hospital: {data.hospital}</li>
                <li>eduBackground: {data.eduBackground}</li>
                <li>status: {data.status}</li>
              </ul>
            )}
          </div>
          <button
            className="btn btn-success position-absolute bottom-0 end-0 m-3 btn-lg"
            onClick={handleBack}
            style={{ backgroundColor: " rgb(65, 105, 225)" }}
          >
            Back
          </button>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default ViewDoctor;
