import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppBar } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";
import { useNavigate } from "react-router-dom";




function ChatChoiceDR() {
    const navigate = useNavigate();

    const handlePharmacistChat = () => {
        navigate("/ChatPharmacistDR");
    };

    const handlePatientChat = () => {
        navigate("/ChatPatientDR");
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
                        marginLeft: "35%",
                    }}
                ></div>
                <p></p>
                <p></p>
                <p></p>
                <div
                    className="card m-3 col-12 text-center"
                    style={{ width: "80%", borderRadius: "50px", left: "9%" }}
                >
                    <h2>Chat Options</h2>
                    <p></p>
                    <div className="d-flex justify-content-center mb-3">
                        <button
                            onClick={handlePharmacistChat}
                            style={{
                                backgroundColor: "rgb(65, 105, 225)",
                                width: "30%",
                                borderRadius: "20px",
                                marginRight: "20px", // Increase the margin for more space
                                fontSize: "1.5em",
                            }}
                            type="submit"
                            className="btn btn-success"
                        >
                            Chat with Pharmacist
                        </button>

                        <button
                            onClick={handlePatientChat}
                            style={{
                                backgroundColor: "rgb(65, 105, 225)",
                                width: "30%",
                                borderRadius: "20px",
                                fontSize: "1.5em",
                            }}
                            type="submit"
                            className="btn btn-success"
                        >
                            Chat with Patient
                        </button>
                    </div>
                </div>

                <BottomBar />
            </AppBar>
        </div>
    );
}

export default ChatChoiceDR;
