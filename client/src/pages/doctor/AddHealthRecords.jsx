// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
function AddHealthRecords() {
  const [file, setFile] = useState();
  const [date, setDate] = useState();
  const [description, setDescription] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
   
  const isFormValid = date && description && file;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/doctor/addHealthRecords",
        {
          doctorId: "6527c67e46e93ddb9af7b73f",
          patientId: id,
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
      setShowAlert(true);
      setAlertMessage("Health records Added Successfully");
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 9000);
      console.log(response.data);
    } catch (error) {
      console.error("Error adding health records:", error);
      setShowAlert(true);
    }
  };
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
            Add Health Records
          </h1>
        </div>
        {showAlert && (
         <Alert
         style={{
           marginTop: "2%",
           fontSize: "18px",
           backgroundColor:  "RGB(50, 205, 50)" ,
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
          <form onSubmit={handleSubmit}>
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
                  <strong>document</strong>
                </label>
                <input
                  type="file"
                  className="form-control rounded-0"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                class="btn btn-primary"
                disabled={!isFormValid}
              >
                add
              </button>
            </div>
          </form>
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
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default AddHealthRecords;
