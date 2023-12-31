// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarAdmin";
import BottomBar from "../../components/BottomBar";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
function AddHealthP() {
  const [Name, setName] = useState();
  const [Price, setPrice] = useState();
  const [doctor, setdoctorsession] = useState();
  const [medicinDiscount, setmedicindiscount] = useState();
  const [familysubscribtion, setfamilysubscribtion] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { id } = useParams();
  const navigate = useNavigate();
   
  const isFormValid = Name && Price && doctor && medicinDiscount && familysubscribtion;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const response = await axios.post(`http://localhost:8000/admin/healthPackage/`, {
            name: Name,
      price: Price,
      sessDiscount: doctor,
      medDiscount: medicinDiscount,
      subDiscount: familysubscribtion,
          });
          setShowAlert(true);
          setAlertSeverity("success");
          setAlertMessage("Health package added Successfully");
          setTimeout(() => {
            setShowAlert(false);
            setAlertMessage("");
          }, 9000);
        } catch (error) {
          setShowAlert(true);
          console.log("error.response.data.error",error.response.data.error)
          if (error.response && error.response.data.error === "Invalid price format. Please enter a valid number.") {
            setAlertMessage("Invalid price format. Please enter a valid number.");
            setAlertSeverity("error");
            
          }
        
          
                setTimeout(() => {
                  setShowAlert(false);
                  setAlertSeverity("");
                  setAlertMessage("");
                }, 9000);
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
            Add Health Package
          </h1>
        </div>
        {showAlert && (
         <Alert
         style={{
           marginTop: "2%",
           fontSize: "18px",
           backgroundColor:alertSeverity === "success" ? "RGB(50, 205, 50)" : "red",
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
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          <form onSubmit={handleSubmit}>
            <div>
              <div className="mb-3">
                <label>
                  <strong>Name</strong>
                </label>
                <input
                 type="text"
                 placeholder="enter name"
                 className="form-control rounded-0"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Price</strong>
                </label>
                <input
                  type="text"
                  placeholder="enter price"
                  className="form-control rounded-0"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>doctor's session price discount:</strong>
                </label>
                <input
                   type="text"
                   placeholder="enter doctor's session price discount"
                   className="form-control rounded-0"
                  onChange={(e) => setdoctorsession (e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>medicin discount:</strong>
                </label>
                <input
                  type="text"
                  placeholder="enter medicin discount"
                  className="form-control rounded-0"
                  onChange={(e) => setmedicindiscount (e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>family subscribtion discount:</strong>
                </label>
                <input
                 type="text"
                 placeholder="enter family subscribtion discount"
                 className="form-control rounded-0"
                  onChange={(e) => setfamilysubscribtion (e.target.value)}
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
        
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default AddHealthP;
