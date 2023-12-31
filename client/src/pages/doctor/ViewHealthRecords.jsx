import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";
import config from "../../config/config";
import { useNavigate, useLocation } from "react-router-dom";
function Health() {
  const [healthData, setHealthData] = useState({});
  const [loading, setLoading] = useState(true);
  const { patientID } = useParams();
  const location = useLocation();
  const doctorID = "6526653e47c45e179aa6886b";
  
  const navigate = useNavigate();
  useEffect(() => {
    const apiUrl = "http://localhost:8000/doctor/getHealthRecord";
    axios
      .post(apiUrl, {
        doctorID,
        patientID,
      })
      .then((response) => {
        if (response.data && response.data.health_records) {
          setHealthData(response.data.health_records);
          setLoading(false);
        } else {
          console.error("Invalid data structure:", response.data);
         
          setHealthData({});
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);

        setHealthData({});
        setLoading(false);
      });
  }, [patientID]);

 
  const list = healthData.records?.map((user, i) => (
    <div
      key={i}
      className="card"
      style={{
        width: 300,
        margin: 50,
        border: "5px solid ",
        borderColor: "black",
      }}
    >
      <img
        style={{ height: 200, width: 200 }}
        src={config.STORAGE_URL + user?.image}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">Record : {i + 1}</h5>
        <p className="card-text">description : {user?.description}</p>
        <p className="card-text">date : {user?.date}</p>
      </div>
    </div>
  ));
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
            Health Records
          </h1>
        </div>
       
          
        <div className="card m-3 col-12" style={{ width: "80%", left: "8%" }}>
          <div style={{ display: "inline-flex", flexWrap: "wrap" }}>{list}</div>
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
        </div>
       
       
        <BottomBar />
        
      </AppBar>
     
    </div>
    
  );
}
export default Health;
