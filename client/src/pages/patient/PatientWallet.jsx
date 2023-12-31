import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { Alert } from "@mui/material";
import ResponsiveAppBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function PatientWallet() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  // Manually set the patient ID
  const patientName = "test";

  useEffect(() => {
    const apiUrl = `http://localhost:8000/patient/getWallet/${patientName}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);
        setWallet(response.data); // Assuming response.data.wallet is a number
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred");
        setLoading(false);
      });
  }, [patientName]);

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
            My Wallet
          </h1>
        </div>
        <div
          className="card m-3 col-12"
          style={{ width: "80%", left: "8%", borderRadius: "20px" }}
        >
          <div className="card-body">
            {loading ? (
              <CircularProgress color="success" />
            ) : error ? (
              <p>
                <Alert
                  style={{
                    marginTop: "5%",
                    fontSize: "18px",
                    backgroundColor: " RGB(205, 92, 92)",
                  }}
                  variant="filled"
                  severity="error"
                >
                  Error: {error}
                </Alert>
              </p>
            ) : (
              <div
                style={{
                  fontFamily: "Roboto",
                  fontSize: "24px",
                  fontWeight: "bolder",
                }}
              >
                ${wallet}
              </div>
            )}
          </div>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default PatientWallet;
