import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../App.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ResponsiveAppBar from "../../components/TopBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import BottomBar from "../../components/BottomBar";

// THIS PAGE IS NOT USED BECAUSE WE DISCOVERED THAT IT WAS ALREADY IMPLEMENTED

const requestData = {
  patientId: "651fd358364267c68b56ba41",
  // Add more data as needed
};

const formatDate = (dateTime) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateStr = new Date(dateTime).toLocaleDateString("en-GB", options);
  const timeStr = new Date(dateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${dateStr} ${timeStr}`;
};

const PatientAppointments = () => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  useEffect(() => {
    getApps();
  }, []);

  const getApps = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/patient/appointmentWithFilter",
        requestData
      );
      const appointments = response.data;
      console.log(appointments);
      setAppointments(appointments);
      setFilteredAppointments(appointments); // Set initial filteredAppointments

      // After fetching appointments, fetch doctors
      getDrs(appointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const getDrs = async (appointments) => {
    const doctorPromises = appointments.map((appointment) => {
      const doctorId = appointment.doctorId;

      // Make a separate Axios call for each doctorId
      return axios
        .get(`http://localhost:8000/doctor/${doctorId}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(`Failed to fetch doctor ${doctorId}:`, error);
          return null;
        });
    });

    // Wait for all doctor requests to complete
    Promise.all(doctorPromises).then((doctorData) => {
      setDoctors(doctorData);
    });
  };

  const filterByStatus = (status) => {
    const filtered = appointments.filter(
      (appointment) => appointment.status === status
    );
    setFilteredAppointments(filtered);
  };

  const filterByDate = (day, month, year) => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const filterDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

      // Compare the dates (ignoring time)
      return (
        appointmentDate.getDate() === filterDate.getDate() &&
        appointmentDate.getMonth() === filterDate.getMonth() &&
        appointmentDate.getFullYear() === filterDate.getFullYear()
      );
    });

    setFilteredAppointments(filtered);
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
            Your Appointments
          </h1>
        </div>
        <div className="card m-3 col-12" style={{ width: "80%", left: "8%" }}>
          <Box>
            <Button
              variant="contained"
              onClick={getApps}
              margin="normal"
              padding="normal"
              style={{ marginRight: "10px" }}
            >
              All Appointments
            </Button>
            <Button
              variant="contained"
              onClick={() => filterByStatus("Upcoming")}
              margin="normal"
              padding="normal"
              style={{ marginRight: "10px" }}
            >
              Upcoming Appointments
            </Button>
            <Button
              variant="contained"
              onClick={() => filterByStatus("Completed")}
              margin="normal"
              padding="normal"
              style={{ marginRight: "10px" }}
            >
              Completed Appointments
            </Button>
            <Button
              variant="contained"
              onClick={() => filterByStatus("Cancelled")}
              margin="normal"
              padding="normal"
              style={{ marginRight: "10px" }}
            >
              Cancelled Appointments
            </Button>
            <Button
              variant="contained"
              onClick={() => filterByStatus("Rescheduled")}
              margin="normal"
              padding="normal"
              style={{ marginRight: "10px" }}
            >
              Rescheduled Appointments
            </Button>
            <TextField
              label="DD"
              variant="outlined"
              margin="normal"
              padding="normal"
              style={{ width: "80px", marginRight: "10px" }}
              value={day}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Replace any non-digit characters
                setDay(value);
              }}
            />
            <TextField
              label="MM"
              variant="outlined"
              margin="normal"
              padding="normal"
              style={{ width: "80px", marginRight: "10px" }}
              value={month}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Replace any non-digit characters
                setMonth(value);
              }}
            />
            <TextField
              label="YYYY"
              variant="outlined"
              margin="normal"
              padding="normal"
              style={{ width: "80px", marginRight: "10px" }}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Replace any non-digit characters
                setYear(value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => filterByDate(day, month, year)}
              margin="normal"
              padding="normal"
              style={{ width: "100px", marginRight: "10px", marginTop: "15px" }}
            >
              Filter by Date
            </Button>
            {/* You can add more filter buttons as needed */}
          </Box>

          <div className="appointment-cards">
            {filteredAppointments.map((appointment) => {
              const doctorId = appointment.doctorId;
              const doctor = doctors.find((doc) => doc._id === doctorId);

              return (
                <Card
                  key={appointment._id}
                  sx={{ minWidth: 275, marginBottom: 2 }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {doctor ? doctor.name : "Doctor Not Found"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {appointment.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {formatDate(appointment.date)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
};

export default PatientAppointments;
