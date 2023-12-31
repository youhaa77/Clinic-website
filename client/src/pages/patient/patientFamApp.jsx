import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/Wallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CancelIcon from "@mui/icons-material/Cancel";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import moment from "moment";
const PatientFamApp = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  //search appointments
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/appointment/getMyAppointments`
        );
        console.log(response.data);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, []);

  const searchApp = (event) => {
    if (event) {
      event.preventDefault();
    }

    axios
      .post("http://localhost:8000/doctor/appointmentWithFilter", {
        startDate,
        endDate,
        status,
      })
      .then((response) => {
        console.log(response.data);
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  function handleWalletPayment() {
    window.location.href = "/appointmentWalletPayment";
  }
  const handleCreditCardPayment = () => {
    //window.location.href = '/appointmentCreditCardPayment' ;
    axios
      .post("http://localhost:8000/AppointmentCheckout")
      .then((response) => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleOpenCancelDialog = (appId) => {
    setSelectedApp(appId);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  const handleConfirmCancel = async () => {
    try {
      // Implement your cancellation logic here
      const reqBody = {
        _id: selectedApp,
      };

      // Make a request to update the status to 'cancelled'
      const updatedAppointment = await axios.post(
        `http://localhost:8000/appointment/cancelAppointment/${selectedApp}`,
        reqBody
      );

      // Update the state with the updated appointment data
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedApp
            ? updatedAppointment.data
            : appointment
        )
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }

    handleCloseCancelDialog();
  };

  function handleRescheduleApp(id, drId) {
    window.location.href = `/RescheduleApp/${id}/${drId}`;
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
            My Appointments
          </h1>
        </div>
        <div
          className="card m-3 col-1"
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <input
                  className="form-control m-2"
                  type="datetime-local"
                  placeholder="search by start date"
                  autoComplete="off"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  className="form-control m-2"
                  type="datetime-local"
                  placeholder="search by end date"
                  autoComplete="off"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                  className="form-control m-2"
                  type="text"
                  placeholder="search by status"
                  autoComplete="off"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <button className="btn btn-primary m-2" onClick={searchApp}>
                  search
                </button>
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment1) => (
                      <tr key={appointment1._id}>
                        <td>{appointment1?.doctorId.name}</td>
                        <td>
                          {moment(appointment1?.date).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </td>
                        <td>{appointment1?.status}</td>
                        <td>
                          {appointment1.status !== "cancelled" && (
                            <form
                              action="http://localhost:8000/AppointmentCheckout"
                              method="POST"
                            >
                              <Tooltip
                                title="Pay using credit card"
                                placement="bottom"
                              >
                                <IconButton type="submit">
                                  <CreditCardIcon></CreditCardIcon>
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Pay using wallet"
                                placement="bottom"
                              >
                                <IconButton onClick={handleWalletPayment}>
                                  <WalletIcon></WalletIcon>
                                </IconButton>
                              </Tooltip>
                            </form>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "inline" }}>
                            <div>
                              {appointment1.status !== "cancelled" && (
                                <div>
                                  <Tooltip
                                    title="Reschedule Appointment"
                                    placement="bottom"
                                  >
                                    <IconButton
                                      onClick={() => {
                                        handleRescheduleApp(
                                          appointment1._id,
                                          appointment1.doctorId._id
                                        );
                                      }}
                                    >
                                      <EventRepeatIcon></EventRepeatIcon>
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title="Cancel Appointment"
                                    placement="bottom"
                                  >
                                    <IconButton
                                      onClick={() => {
                                        handleOpenCancelDialog(
                                          appointment1._id
                                        );
                                      }}
                                    >
                                      <CancelIcon></CancelIcon>
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
          <DialogTitle>
            No refunds if time left is less than 24 hours!!.. Are you sure you
            want to cancel this appointment?
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
      </AppBar>
    </div>
  );
};

export default PatientFamApp;
