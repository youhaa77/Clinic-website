import { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";
import { Alert } from "@mui/material";
import { useParams } from "react-router-dom";

function ScheduleFollowUp() {
    const [availableSlots, setAvailableSlots] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const { id } = useParams();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const reqBody = {
                patientID: id,
                date: availableSlots,
                status: "Accepted",
                type: "follow up",
            };
            const newApp = await axios.post(
                "http://localhost:8000/appointment/createFollowUp",
                reqBody
            );
            setShowAlert(true);
            setAlertSeverity("success");
            setAlertMessage("FollowUp scheduled Successfully");

            setTimeout(() => {
                setShowAlert(false);
                setAlertSeverity("");
                setAlertMessage("");
            }, 9000);
            console.log(response.data);
        } catch (error) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                setAlertSeverity("");
                setAlertMessage("");
            }, 9000);
            console.error("Error in scheduling the followUp:", error);
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
                        Schedule FollowUp
                    </h1>
                </div>
                {showAlert && (
                    <Alert
                        style={{
                            marginTop: "2%",
                            fontSize: "18px",
                            backgroundColor: alertSeverity === "success" ? "RGB(50, 205, 50)" : "red",
                            width: "70%",
                            marginLeft: "15%",
                            textAlign: "center",
                        }}
                        variant="filled"
                        onClose={() => {
                            setShowAlert(false);
                            setAlertSeverity("");
                            setAlertMessage("");
                        }}
                        dismissible
                    >
                        {alertMessage}
                    </Alert>
                )}
                <div
                    className="card m-3 col-12"
                    style={{ width: "80%", borderRadius: "50px", left: "9%" }}
                >
                    <div className="card-body" style={{}}>
                        <form action="" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="availableSlots">
                                    <strong>Available Slots</strong>
                                </label>
                                <h6>format: 05/05/2001 17:00:00</h6>
                                <input
                                    type="text"
                                    placeholder="Enter available slots"
                                    autoComplete="off"
                                    name="availableSlots"
                                    className="form-control rounded-0"
                                    value={availableSlots}
                                    onChange={(e) => setAvailableSlots(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={!availableSlots.trim()}>
                                Add
                            </button>
                        </form>
                    </div>
                </div>
                <BottomBar />
            </AppBar>
        </div>
    );
}

export default ScheduleFollowUp;
