import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { useNavigate, createSearchParams } from "react-router-dom";
import DoctorSignup from "./pages/auth/DoctorSignup";
import PatientSignup from "./pages/auth/PatientSignup";
import CallIcon from "@mui/icons-material/Call";
import IconButton from "@mui/material/IconButton";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Home from "./pages/Home";
import PrescriptionsList from "./pages/patient/PrescriptionsList";
import EditDoctor from "./pages/doctor/EditDoctor";
import AllDoctors from "./pages/patient/AllDoctors";
import DoctorInfo from "./pages/patient/DoctorInfo";
import ViewDoctor from "./pages/patient/ViewDoctor";
import FilterDoctor from "./pages/patient/FilterDoctor";
import Call from "./pages/doctor/CallPatient";
import Calld from "./pages/patient/CallDoctor";
import { useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
//import Peer from "simple-peer"
//youhanna milestone 2222
import PatientUpcomingAppointments from "./pages/doctor/PatientUpcomingAppointments";
import Doctorlogin from "./pages/auth/DoctorLogin";
import Adminlogin from "./pages/auth/AdminLogin";
import Patientlogin from "./pages/auth/PatientLogin";
import Forget from "./pages/auth/ForgetPassword";
import ChangePass from "./pages/patient/chnagePass";
import ChangePassDoc from "./pages/doctor/changePassDoc";
import ChangePassAdm from "./pages/admin/changePassAdm";
import PatientAppointments from "./pages/doctor/PatientAppointments";
import AppPatient from "./pages/patient/patientFamApp";
import MyPatientsList from "./pages/doctor/MyPatientsList";

import AddAdmin from "./pages/admin/AddAdmin";
import RemoveUser from "./pages/admin/RemoveUser";
import PendingDoctors from "./pages/admin/PendingDoctors";
import DoctorDetails from "./pages/admin/DoctorDetails";
import Health from "./pages/doctor/ViewHealthRecords";
import AddTimeSlots from "./pages/doctor/AddTimeSlots";
import AddHealthRecords from "./pages/doctor/AddHealthRecords";
import PatientHealthRecords from "./pages/patient/PatientHealthRecords";
import MainDoctor from "./pages/doctor/DoctorAppointments";
import App1 from "./pages/admin/adminHealthP";
import PrescriptionsDetails from "./pages/patient/PrescriptionDetails";
import AddhealthPackage from "./pages/admin/AddHealthP";
//apply sessDiscount for patients
import DoctorsWithDiscount from "./pages/patient/DoctorsWithDiscount";
import AppointmentWalletPayment from "./pages/patient/AppointmentWalletPayment";
import PatientWallet from "./pages/patient/PatientWallet";
import DoctorWallet from "./pages/doctor/DoctorWallet";
import FollowUP from "./pages/doctor/FollowUP";
import HomePage from "./pages/patient/HomePage";
import HomePageDoc from "./pages/doctor/HomePageDoc";
import PatientHP_FM from "./pages/patient/PatientFamily";
//////////////here
import HealthPackageNEW from "./pages/patient/HealthPackage";
import AvailableAppointments from "./pages/patient/AvailableAppointments";
import RescheduleApp from "./pages/patient/RescheduleApp";
import HomePageAdmin from "./pages/admin/HomePageAdmin";
import axios from "axios";
import { useEffect, useState } from "react";
import DoctorContract from "./pages/doctor/DoctorContract";
import FollowUPPending from "./pages/doctor/FollowUPPending";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

// chat patient
// Chat patient
import ChatPharmacist from "./pages/patient/ChatPharmacist";
import ChatChoice from "./pages/patient/ChatChoice";
import ChatDoctor from "./pages/patient/ChatDoctor";

// chat doctor
import ChatChoiceDR from "./pages/doctor/ChatChoiceDR";
import ChatPharmacistDR from "./pages/doctor/ChatPharmacistDR";
import ChatPatientDR from "./pages/doctor/ChatPatientDR";

import ScheduleFollowUp from "./pages/doctor/ScheduleFollowUp";

import io from "socket.io-client";
//const socket = io.connect("http://localhost:8000");
import Peer from "simple-peer";
import AddPrescription from "./pages/doctor/AddPrescription";
import DoctorPrescriptionsList from "./pages/doctor/DoctorPresriptionsList";
import UpdatePrescription from "./pages/doctor/UpdatePrescription";

axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
  sessionStorage.getItem("token")
)}`;
const token = JSON.parse(sessionStorage.getItem("token"));

function App() {
  const navigate = useNavigate();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [type, setData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [name, setName] = useState("");
  const location = useLocation();
  const socket = io.connect("http://localhost:8000", {
    query: {
      username: "john_doe",
      room: token,
    },
  });

  useEffect(() => {
    socket.on("callUser", (data) => {
      setDataFetched(false);
      console.log("calluser fy chat");
      console.log("georgeee   " + data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      setDataFetched(true);
    });
    socket.on("callEnded", () => {
      setReceivingCall(false);
      setCalling(false);
    });

    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:8000/admin/getType");

        setData(result.data.type);
        setDataFetched(true);
      } catch (err) {
        console.log(err);
        setDataFetched(true);
      }
    };

    fetchData();
  }, [token]);

  const answerCall = () => {
    console.log("hhhh");
    navigate("/Call", {
      state: {
        back: location.pathname,
        video: true,
        answerCall: true,
        caller: caller,
        callerUserSignal: callerSignal,
      },
    });
    setReceivingCall(false);
  };
  const endCall = () => {
    console.log("hhhh");
    socket.emit("left");
    setReceivingCall(false);
  };

  if (!dataFetched) {
    return <CircularProgress color="success" />; // Render nothing until data is fetched
  }
  if (receivingCall) {
    const imageUrl =
      "https://static.vecteezy.com/system/resources/previews/004/477/337/non_2x/face-young-man-in-frame-circular-avatar-character-icon-free-vector.jpg";
    return (
      <div className="caller">
        {/* { <h1 >{name} is calling...</h1> }

      <IconButton color="primary" aria-label="call" style={{ backgroundColor: "lightblue",margin:"10px" }} onClick={answerCall}>
					 	<CallIcon  fontSize="large" />
					 </IconButton>
      <IconButton color="primary" aria-label="call" style={{ backgroundColor: "lightcoral",margin:"10px" }} onClick={endCall}>
					 	<CallEndIcon  fontSize="large" />
					 </IconButton> */}
        <Card
          className="caller"
          style={{ maxWidth: 400, margin: "auto", marginTop: 20 }}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Avatar
                alt={name}
                src={imageUrl}
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
              <Typography variant="h5" component="h2">
                <span style={{ color: "darkblue", fontSize: "1.5em" }}>
                  {name}
                </span>{" "}
                is calling...
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <IconButton
                color="primary"
                aria-label="call"
                style={{ backgroundColor: "lightblue", margin: "10px" }}
                onClick={answerCall}
              >
                <CallIcon fontSize="large" />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="call"
                style={{ backgroundColor: "lightcoral", margin: "10px" }}
                onClick={endCall}
              >
                <CallEndIcon fontSize="large" />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  //console.log(type)
  if (type === "Patient") {
    console.log("fady");
    return (
      <div>
        <div
          style={{ position: "relative", zIndex: 1 }}
          className="your-custom-class"
        >
          {" "}
          {/* Add your desired class for styling */}
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <Routes>
            <Route path="/prescriptionsList" element={<PrescriptionsList />} />

            <Route
              path="/prescriptions/:id"
              element={<PrescriptionsDetails />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/allDoctors" element={<AllDoctors />} />
            <Route path="/doctorInfo/:id" element={<DoctorInfo />} />
            <Route path="/viewDoctor/:id" element={<ViewDoctor />} />
            <Route path="/filter" element={<FilterDoctor />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/ChatChoice" element={<ChatChoice />} />
            <Route path="/ChatDoctor" element={<ChatDoctor />} />
            <Route path="/Chatpharmacist" element={<ChatPharmacist />} />
            {/* this doctor details is in admin */}
            <Route path="/patientFamilyAppointments" element={<AppPatient />} />
            <Route
              path="/DoctorsWithDiscount"
              element={<DoctorsWithDiscount />}
            />
            <Route
              path="/appointmentWalletPayment"
              element={<AppointmentWalletPayment />}
            />
            <Route
              path="/PatientHealthRecords/:patientId"
              element={<PatientHealthRecords />}
            />
            <Route
              path="/PatientWallet/:patientName"
              element={<PatientWallet />}
            />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/PatientHP_FM" element={<PatientHP_FM />} />
            <Route path="/healthPackage" element={<HealthPackageNEW />} />
            {/* <Route path="/PatientAppointments" element={<PatientAppointments />} /> MYRIAM*/}
            <Route
              path="/AvailableAppointments/:id"
              element={<AvailableAppointments />}
            />
            <Route path="/Call" element={<Calld />} />
            <Route path="/ForgetPassword" element={<Forget />} />
            <Route path="/changePassPat" element={<ChangePass />} />
            <Route
              path="/RescheduleApp/:id/:drId"
              element={<RescheduleApp />}
            />
          </Routes>
        </div>
      </div>
    );
  } else if (type === "Doctor") {
    return (
      <div>
        <Routes>
          <Route path="/editDoctor" element={<EditDoctor />} />
          <Route path="/" element={<Home />} />
          <Route path="/AddHealthRecords/:id" element={<AddHealthRecords />} />
          <Route path="/AddPrescription/:id" element={<AddPrescription />} />
          <Route
            path="/doctor/prescriptions/:id"
            element={<DoctorPrescriptionsList />}
          />
          <Route
            path="/prescriptionDetails/:id/:prescriptionId"
            element={<UpdatePrescription />}
          />
          <Route path="/DoctorWallet/:doctorName" element={<DoctorWallet />} />
          <Route path="/FollowUP/:doctorName" element={<FollowUP />} />
          <Route
            path="FollowUPPending/:doctorName"
            element={<FollowUPPending />}
          />
          <Route path="/AddTimeSlots" element={<AddTimeSlots />} />
          <Route path="/HomePageDoc" element={<HomePageDoc />} />
          <Route path="/viewMyPatients" element={<MyPatientsList />} />
          <Route path="/ScheduleFollowUp/:id" element={<ScheduleFollowUp />} />
          <Route path="/contract" element={<DoctorContract />} />
          <Route path="/ChatChoiceDR" element={<ChatChoiceDR />} />{" "}
          <Route path="/ChatPharmacistDR" element={<ChatPharmacistDR />} />{" "}
          <Route path="/ChatPatientDR" element={<ChatPatientDR />} />{" "}
          <Route
            path="/PatientAppointments"
            element={<PatientAppointments />}
          />
          <Route path="/doctorAppointments" element={<MainDoctor />} />
          <Route path="/viewHealth/:patientID" element={<Health />} />
          <Route path="/ForgetPassword" element={<Forget />} />
          <Route path="/Call" element={<Call />} />
          <Route path="/changePassDoc" element={<ChangePassDoc />} />
          <Route
            path="/PatientUpcomingAppointments/:id"
            element={<PatientUpcomingAppointments />}
          />
        </Routes>
      </div>
    );
  } else if (type === "Admin") {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addAdministrator" element={<AddAdmin />} />
        <Route path="/removeUser" element={<RemoveUser />} />
        <Route path="/pendingDoctors" element={<PendingDoctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/adminHealthPackage" element={<App1 />} />
        <Route path="/adminaddHealthPackage" element={<AddhealthPackage />} />
        <Route path="/ForgetPassword" element={<Forget />} />
        <Route path="/HomePageAdmin" element={<HomePageAdmin />} />
        <Route path="/changePassAdm" element={<ChangePassAdm />} />
      </Routes>
    );
  } else {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registerDoctor" element={<DoctorSignup />} />
          <Route path="/registerPatient" element={<PatientSignup />} />
          <Route path="/DoctorLogin" element={<Doctorlogin />} />
          <Route path="/AdminLogin" element={<Adminlogin />} />
          <Route path="/PatientLogin" element={<Patientlogin />} />
          <Route path="/ForgetPassword" element={<Forget />} />
          <Route path="/:any" element={<Home />} />
        </Routes>
      </div>
    );
  }
}

export default App;
