import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import axios from "axios";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function FilterDoctors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTime, setSearchTime] = useState(null);
  const [searchSpec, setSearchSpec] = useState("");
  const [hp, setHp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const patientApiUrl =
      "http://localhost:8000/patient/getPatientHealthPackage/" +
      "6523ba9cd72b2eb0e39cb137";
    axios
      .get(patientApiUrl)
      .then((response) => {
        setHp(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    const apiUrl = "http://localhost:8000/patient/allDoctors";
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
  function handleView(id) {
    // Navigate to another route and pass the ID as a prop
    console.log(id);
    navigate(`/viewDoctor/${id}`);
    console.log(id);
  }
  function handleViewAvailableSlots(id) {
    // Navigate to another route and pass the ID as a prop
    console.log(id);
    navigate(`/AvailableAppointments/${id}`);
    console.log(id);
  }
  function handleFilter() {
    // const response= await axios.get("http://localhost:8000/patient/allDoctors");
    console.log(searchTime);
    console.log(searchSpec);
    axios
      .post("http://localhost:8000/patient/docFilter", {
        searchTime,
        searchSpec,
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data); // Set the content to MainContent with the appointments data
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  function getSessionPrice(hourlyRate) {
    if (hp)
      return hourlyRate + hourlyRate * 0.1 - hourlyRate * hp[0].sessDiscount;
    else return hourlyRate + hourlyRate * 0.1;
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
          className="card m-3 col-12"
          style={{
            width: "80%",
            borderRadius: "20px",
            left: "8%",
            display: "flex",
          }}
        >
          <div className="card-header">
            <h2>All Doctors Details</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>speciality</th>
                    <th>Session Price</th>
                    <th>
                      <input
                        type="datetime-local"
                        placeholder="filter by available slots"
                        autoComplete="off"
                        name="time"
                        className="form-control rounded-0"
                        onChange={(e) => setSearchTime(e.target.value)}
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        placeholder="filter by a spciality"
                        autoComplete="off"
                        name="spec"
                        className="form-control rounded-0"
                        onChange={(e) => setSearchSpec(e.target.value)}
                      />
                    </th>
                    <th>
                      <button
                        style={{ backgroundColor: " rgb(65, 105, 225)" }}
                        className="btn btn-success"
                        onClick={() => handleFilter()}
                      >
                        apply filter on speciality and available slots
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.speciality}</td>
                      <td>{getSessionPrice(item.hourlyRate)}</td>
                      <td></td>
                      <td></td>
                      <td>
                        <Tooltip title="View Details" placement="bottom">
                          <IconButton onClick={() => handleView(item._id)}>
                            <VisibilityIcon></VisibilityIcon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="view Available slots"
                          placement="bottom"
                        >
                          <IconButton
                            onClick={() => handleViewAvailableSlots(item._id)}
                          >
                            <CalendarMonthIcon></CalendarMonthIcon>
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}

export default FilterDoctors;
