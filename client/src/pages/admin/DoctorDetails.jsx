import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarAdmin";
import BottomBar from "../../components/BottomBar";
import axios from "axios";
import config from "../../config/config";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function DoctorDetails() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = "http://localhost:8000/doctor/" + id;
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
    navigate("/pendingDoctors");
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
              <CircularProgress color="success" />
            ) : (
              <ul>
                <li>name: {data.name}</li>
                <li>email: {data.email}</li>
                <li>birthDate: {data.birthDate}</li>
                <li>hourlyRate: {data.hourlyRate}</li>
                <li>hospital: {data.hospital}</li>
                <li>eduBackground: {data.eduBackground}</li>
                <li>status: {data.status}</li>
                {data.idFile.substr(data.idFile.length - 3) == `pdf` ? (
                  <li>
                    <a href={config.STORAGE_URL + data.idFile} download="id">
                      Download id
                    </a>
                  </li>
                ) : (
                  <li>
                    <img
                      style={{ height: 200, width: 200 }}
                      src={config.STORAGE_URL + data.idFile}
                      className="card-img-top"
                    />
                  </li>
                )}
                {data.degreeFile.substr(data.degreeFile.length - 3) == `pdf` ? (
                  <li>
                    <a
                      href={config.STORAGE_URL + data.degreeFile}
                      download="degree"
                    >
                      Download degree
                    </a>
                  </li>
                ) : (
                  <li>
                    <img
                      style={{ height: 200, width: 200 }}
                      src={config.STORAGE_URL + data.degreeFile}
                      className="card-img-top"
                    />
                  </li>
                )}
                {data.licenseFile.substr(data.licenseFile.length - 3) ==
                  `pdf` ? (
                  <li>
                    <a
                      href={config.STORAGE_URL + data.licenseFile}
                      download="license"
                    >
                      Download license
                    </a>
                  </li>
                ) : (
                  <li>
                    <img
                      style={{ height: 200, width: 200 }}
                      src={config.STORAGE_URL + data.licenseFile}
                      className="card-img-top"
                    />
                  </li>
                )}
              </ul>
            )}
          </div>
          <button
            className="btn btn-success position-absolute bottom-0 end-0 m-3 btn-lg"
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

export default DoctorDetails;
