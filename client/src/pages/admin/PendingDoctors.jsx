import React, { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarAdmin";
import BottomBar from "../../components/BottomBar";

function PendingDoctors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = "http://localhost:8000/doctor";
    axios
      .get(apiUrl)
      .then((response) => {
        const pendingDoctors = response.data.filter(
          (doctor) => doctor.status === "Pending"
        );
        setData(pendingDoctors);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  function handleView(id) {
    // Navigate to another route and pass the ID as a prop
    navigate(`/doctors/${id}`);
  }
  const handleAccept = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/doctor/accept/${id}`
      );
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: response.data.status } : item
        )
      );
    } catch (error) {
      console.error("Error accepting doctor:", error);
    }
  };
  const handleReject = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/doctor/reject/${id}`
      );
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: response.data.status } : item
        )
      );
    } catch (error) {
      console.error("Error rejecting doctor:", error);
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
              font: "Arial",
              fontWeight: "bold",
              color: "white",
              margin: "10px",
            }}
          >
            Pending Doctors
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>status</th>
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
                          <td>{item.status}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleView(item._id)}
                            >
                              view
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleAccept(item._id)}
                            >
                              Accept
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleReject(item._id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                        {data.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      <p style={{ color: "red" }}>No pending doctors found.</p>
                    </td>
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



export default PendingDoctors;
