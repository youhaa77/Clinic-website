import { useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Alert from "@mui/material/Alert"; // Import Alert from MUI
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBar.jsx";
import BottomBar from "../../components/BottomBar.jsx";
import axios from "axios";
import config from "../../config/config.js";
import img1 from "../../images/photo.png";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";

function PatientHealthRecords() {
  console.log("Component rendered");
  const [loading, setLoading] = useState(true);
  const [records, setHealthRecords] = useState([]);
  const [file, setFile] = useState();
  const [date, setDate] = useState();
  const [description, setDescription] = useState();
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // Add state for alert
  const [alertMessage, setAlertMessage] = useState("");
  const change2 = useRef(null);

  // Manually set the patient ID
  const patientId = "652f955bdea721b31ef04335";

  useEffect(() => {
    const apiUrl = `http://localhost:8000/patient/health-records/${patientId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setHealthRecords(response.data.records);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [patientId]);

  useEffect(() => {
    // Enable the upload button only if date, description, and file are not empty
    setUploadButtonDisabled(!date || !description || !file);
  }, [date, description, file]);

  const handleAddMedicalHistory = async (e) => {
    e.preventDefault();
    if (!date || !description || !file) {
      // Display a message or perform any other action to inform the user about the missing fields
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/patient/health-records",
        {
          date,
          description,
          file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setHealthRecords(response.data.health_records.records);
      setLoading(false);
      // Reset the form fields
      setDate("");
      setDescription("");
      setFile(null);
      setShowAlert(true);
      setAlertMessage("Health records added successfully");
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error adding health records:", error);
      setShowAlert(true);
      // Handle error as needed
    }
  };

  const handleRemoveMedicalHistory = (id) => {
    axios
      .put("http://localhost:8000/patient/remove-health-records", {
        id,
      })
      .then(() => {
        setHealthRecords((prevRecords) =>
          prevRecords.filter((record) => record._id !== id)
        );
      })
      .catch((err) => console.log(err));
  };

  const list = records.map((record) => (
    <div
      key={record._id}
      className="card"
      style={{
        width: 300,
        margin: 50,
        border: "5px solid ",
        borderColor: "black",
      }}
    >
      <img
        style={{ height: 200, width: 200 }}
        src={config.STORAGE_URL + (record.image || img1)}
        className="card-img-top"
        alt="Record"
      />
      <div className="card-body">
        <p className="card-text">Description: {record.description}</p>
        <p className="card-text">
          Date: {moment(record.date).format("YYYY-MM-DD HH:mm:ss")}{" "}
        </p>
      </div>
      <button
        onClick={() => handleRemoveMedicalHistory(record._id)}
        className="btn btn-danger"
      >
        remove
      </button>
    </div>
  ));
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
            <h2>My Health Records</h2>
          </div>
          {showAlert && (
            <Alert
              style={{
                marginTop: "2%",
                fontSize: "18px",
                backgroundColor: "RGB(50, 205, 50)",
                width: "70%",
                marginLeft: "15%",
                textAlign: "center",
              }}
              variant="filled"
              onClose={() => {
                setShowAlert(false);
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
            <form onSubmit={handleAddMedicalHistory}>
              <div>
                <div className="mb-3">
                  <label>
                    <strong>Date</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-0"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>
                    <strong>Description</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="enter description"
                    className="form-control rounded-0"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>
                    <strong>Document</strong>
                  </label>
                  <input
                    type="file"
                    className="form-control rounded-0"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadButtonDisabled}
                >
                  upload
                </button>
              </div>
            </form>
          </div>

          <div className="card-body">
            <div className="image">
              {loading ? (
                <CircularProgress color="success" />
              ) : records.length === 0 ? (
                <p style={{ color: "red" }}>No health records available.</p>
              ) : (
                <div
                  className="image"
                  style={{ display: "inline-flex", flexWrap: "wrap" }}
                >
                  {list}
                </div>
              )}
            </div>
          </div>
        </div>
      </AppBar>
    </div>
  );
}
export default PatientHealthRecords;
