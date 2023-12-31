import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
const formatDate = (dateTime) => {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Add this option for AM/PM format
  };
  return new Date(dateTime).toLocaleDateString("en-US", options);
};
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null); // set after choosing to reschedule or cancel an app
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false); // set to open cancel dialog
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false); // set to open reschedule dialog
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/patient/appointmentWithFilter")
      .then((response) => {
        console.log(response.data);
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    axios
      .get("http://localhost:8000/doctor/contract")
      .then((res) => {
        setOptions(res.data.availableSlots);
        console.log(res.data.availableSlots);
        console.log(options);
      })
      .catch((error) => {
        console.error("Failed get doctor info (contract)", error);
      });
  }, []);

  const handleOpenCancelDialog = (appId) => {
    setSelectedApp(appId);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedApp(null);
  };

  const handleConfirmCancel = async () => {
    // Implement your cancellation logic here
    const reqBody = {
      _id: selectedApp,
    };
    const newApp = await axios.post(
      "http://localhost:8000/appointment/docCancelAppointment/:id",
      reqBody
    );
    // /cancelAppointment/:id
    handleCloseCancelDialog();
    window.location.href = "/doctorAppointments";
  };
  const handleOpenRescheduleDialog = (appId) => {
    setSelectedApp(appId);
    setRescheduleDialogOpen(true);
  };

  const handleCloseRescheduleDialog = () => {
    setRescheduleDialogOpen(false);
    setSelectedApp(null);
    setSelectedOption(null);
    setSelectedOption(null);
  };

  const handleConfirmReschedule = async () => {
    // Implement your cancellation logic here
    const reqBody = {
      _id: selectedApp,
      date: selectedOption,
    };
    const newApp = await axios.post(
      "http://localhost:8000/appointment/docRescheduleAppointment/:id",
      reqBody
    );
    // /cancelAppointment/:id
    handleCloseRescheduleDialog();
    window.location.href = "/doctorAppointments";
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      {appointments.map((member) => (
        <div
          key={member.id}
          style={{ border: "1px solid black", borderRadius: 5 }}
        >
          <div>
            <p>
              <strong>Doctor ID:</strong> {member.doctorId.name}
            </p>
            <p>
              <strong>patient ID:</strong> {member.patientId.name}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(member.date)}
            </p>
            <p>
              <strong>status:</strong> {member.status}
            </p>
            <p>
              <strong>type:</strong> {member.type}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {member.status !== "cancelled" && (
              <>
                <button
                  className="btn btn-success m-1"
                  onClick={() => handleOpenRescheduleDialog(member._id)}
                >
                  Reschedule Appointment
                </button>
                <button
                  className="btn btn-success m-1"
                  onClick={() => handleOpenCancelDialog(member._id)}
                >
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          Are you sure you want to cancel this appointment?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmCancel} color="primary">
            Yes
          </Button>
          <Button onClick={handleCloseCancelDialog} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={rescheduleDialogOpen} onClose={handleCloseRescheduleDialog}>
        <DialogTitle>Choose the new Slot</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="option-label">my available slots..</InputLabel>
            <Select
              labelId="option-label"
              id="option-select"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatDate(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmReschedule} color="primary">
            Confirm
          </Button>
          <Button onClick={handleCloseRescheduleDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const AppointmentFilterPage = ({ appointments }) => {
  console.log(appointments);
  const [selectedApp, setSelectedApp] = useState(null); // set after choosing to reschedule or cancel an app
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false); // set to open cancel dialog
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false); // set to open reschedule dialog
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const handleOpenCancelDialog = (appId) => {
    setSelectedApp(appId);
    setCancelDialogOpen(true);
  };
  useEffect(() => {
    axios
      .get("http://localhost:8000/doctor/contract")
      .then((res) => {
        setOptions(res.data.availableSlots);
        console.log(res.data.availableSlots);
        console.log(options);
      })
      .catch((error) => {
        console.error("Failed get doctor info (contract)", error);
      });
  }, []);
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedApp(null);
  };

  const handleConfirmCancel = async () => {
    // Implement your cancellation logic here
    const reqBody = {
      _id: selectedApp,
    };
    const newApp = await axios.post(
      "http://localhost:8000/appointment/docCancelAppointment/:id",
      reqBody
    );
    // /cancelAppointment/:id
    handleCloseCancelDialog();
    window.location.href = "/doctorAppointments";
  };
  const handleOpenRescheduleDialog = (appId) => {
    setSelectedApp(appId);
    setRescheduleDialogOpen(true);
  };

  const handleCloseRescheduleDialog = () => {
    setRescheduleDialogOpen(false);
    setSelectedApp(null);
    setSelectedOption(null);
    setSelectedOption(null);
  };

  const handleConfirmReschedule = async () => {
    // Implement your cancellation logic here
    const reqBody = {
      _id: selectedApp,
      date: selectedOption,
    };
    const newApp = await axios.post(
      "http://localhost:8000/appointment/docRescheduleAppointment/:id",
      reqBody
    );
    // /cancelAppointment/:id
    handleCloseRescheduleDialog();
    window.location.href = "/doctorAppointments";
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      {appointments.map((member) => (
        <div
          key={member.id}
          style={{ border: "1px solid black", borderRadius: 5 }}
        >
          <div>
            <p>
              <strong>Doctor ID:</strong> {member.doctorId.name}
            </p>
            <p>
              <strong>patient ID:</strong> {member.patientId.name}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(member.date)}
            </p>
            <p>
              <strong>status:</strong> {member.status}
            </p>
            <p>
              <strong>type:</strong> {member.type}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {member.status !== "cancelled" && (
              <>
                <button
                  className="btn btn-success m-1"
                  onClick={() => handleOpenRescheduleDialog(member._id)}
                >
                  Reschedule Appointment
                </button>
                <button
                  className="btn btn-success m-1"
                  onClick={() => handleOpenCancelDialog(member._id)}
                >
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          Are you sure you want to cancel this appointment?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmCancel} color="primary">
            Yes
          </Button>
          <Button onClick={handleCloseCancelDialog} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={rescheduleDialogOpen} onClose={handleCloseRescheduleDialog}>
        <DialogTitle>Choose the new Slot</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="option-label">my available slots..</InputLabel>
            <Select
              labelId="option-label"
              id="option-select"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatDate(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmReschedule} color="primary">
            Confirm
          </Button>
          <Button onClick={handleCloseRescheduleDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const Header = () => <div></div>;

//<button style={{width: '100%', height:40}} onClick={() => {changeContent(<Buttons />);setShowForm(false);}}>Health Packages</button>
const Sidebar1 = ({
  changeContent,
  showForm,
  setShowForm,
  showHello,
  setShowHello,
}) => (
  <div
    style={{
      width: "20%",
      height: "calc(100vh - 100px)",
      border: "1px solid black",
      borderRadius: "20px",
    }}
  >
    <div
      id="welcomeTitle"
      style={{
        border: "1px solid black",
        backgroundColor: " rgb(65, 105, 225)",
        color: "white",
        height: 60,
        fontSize: 25,
        borderRadius: "20px",
        textAlign: "center",
      }}
    >
      Welcome Doctor
    </div>
    <button
      className="btn btn-success"
      style={{
        width: "100%",
        height: 40,
        marginTop: "10%",
        borderRadius: "20px",
      }}
      onClick={() => {
        changeContent(<Appointments />);
        setShowHello(true);
      }}
    >
      Appointments
    </button>
  </div>
);

const MainContent = ({ content }) => (
  <div
    style={{
      width: "60%",
      height: "calc(100vh - 100px)",
      border: "1px solid black",
      borderRadius: "20px",
    }}
  >
    {content}
  </div>
);

const Footer = () => (
  <div
    style={{
      width: "100%",
      border: "1px solid black",
      textAlign: "center",
      borderRadius: "20px",
    }}
  >
    <p>Contact us on (+100)123456788 or by email clinic@gmail.com</p>
  </div>
);

const RightSidebar = ({ showForm, showHello }) => (
  <div
    style={{
      width: "20%",
      height: "calc(100vh - 100px)",
      border: "1px solid black",
      borderRadius: "20px",
    }}
  ></div>
);

const MainDoctor = () => {
  const [content, setContent] = useState("Click a button to change content");
  const [showHello, setShowHello] = useState(false);

  //search appointments
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const doctorId = "6526653e47c45e179aa6886b";

  const searchApp = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/doctor/appointmentWithFilter", {
        startDate,
        endDate,
        status,
        doctorId,
      })
      .then((response) => {
        console.log(response.data);
        setContent(<AppointmentFilterPage appointments={response.data} />); // Set the content to MainContent with the appointments data
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    console.log(content);
  };

  return (
    <>
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
              Welcome Doctor
            </h1>
          </div>
          <div
            className="card m-3 col-12"
            style={{ width: "80%", borderRadius: "20px", left: "8%" }}
          >
            <Header />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                height: "calc(100vh - 100px)",
              }}
            >
              <Sidebar1
                changeContent={setContent}
                showHello={showHello}
                setShowHello={setShowHello}
              />
              <MainContent content={content} />
              <div
                style={{
                  width: "20%",
                  height: "calc(100vh - 100px)",
                  border: "1px solid black",
                  borderRadius: "20px",
                }}
              >
                {showHello && (
                  <form>
                    <h2
                      style={{
                        backgroundColor: " rgb(65, 105, 225)",
                        color: "white",
                        marginBottom: "20px",
                        height: "50px",
                        borderRadius: "20px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      Appointments
                    </h2>
                    <label style={{ marginBottom: "10px" }}>
                      Start Date:
                      <input
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          height: "40px",
                        }}
                        placeholder="  Start Date"
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </label>
                    <label style={{ marginBottom: "10px" }}>
                      End Date:
                      <input
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          height: "40px",
                        }}
                        placeholder="  End Date"
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </label>
                    <label style={{ marginBottom: "10px" }}>
                      Status:
                      <input
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          height: "40px",
                        }}
                        placeholder="  Example: Accepted"
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-success m-3 btn-sm"
                      style={{
                        marginTop: "5%",
                        width: "50%",
                        height: "40px",
                        fontSize: "16px",
                      }}
                      onClick={searchApp}
                    >
                      Apply Filter
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <BottomBar />
        </AppBar>
      </div>
      <Footer />
    </>
  );
};
//for the doctor
// ReactDOM.render(<MainDoctor />, document.getElementById('root'));

export default MainDoctor;
