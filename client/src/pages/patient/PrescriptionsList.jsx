import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBar";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function PrescriptionsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [filterMessage, setFilterMessage] = useState("");
  const navigate = useNavigate();
  const name = useRef(null);
  const date = useRef(null);
  const status = useRef(null);
  const filter = useRef(null);

  useEffect(() => {
    const apiUrl =
      "http://localhost:8000/patient/getPerscriptions?patientId=6523ba9cd72b2eb0e39cb137";
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        // Check if the filtered result is empty and set the message accordingly
        if (response.data.length === 0) {
          setFilterMessage("No prescriptions are available");
        } else {
          setFilterMessage("");
        }
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [refresh]);

  function handleClick() {
    let body = { patientId: "6523ba9cd72b2eb0e39cb137" };
    if (name.current.checked) {
      body = {
        ...body,
        doctorName: filter.current.value,
      };
    } else if (date.current.checked) {
      body = {
        ...body,
        date: filter.current.value,
      };
    } else {
      body = {
        ...body,
        state: filter.current.value,
      };
    }
    const apiUrl = "http://localhost:8000/patient/filterPerscriptions";
    axios
      .post(apiUrl, body)
      .then((result) => {
        setData(result.data);
        console.log(result.data);
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  const handleDownload = async (prescriptionId) => {
    try {
      // Make a request to the backend endpoint
      const response = await axios.get(
        `http://localhost:8000/patient/prescriptionPDF/${prescriptionId}`,
        {
          responseType: "arraybuffer", // Ensure the response type is set to arraybuffer for binary data
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "prescription.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error as needed
    }
  };

  const handleBuy = async (prescriptionId) => {
    await axios
      .post(
        `http://localhost:8000/patient/payForPrescription/${prescriptionId}`,
        {}
      )
      .then((response) => {
        console.log(response);
        setRefresh(!refresh);
        window.open("http://localhost:3000/cart", "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleView(id) {
    // Navigate to another route and pass the ID as a prop
    navigate(`/prescriptions/${id}`);
  }

  const listo = data.map((user, i) => {
    console.log(user);
    return (
      <div key={i} style={{ width: 400, display: "inline-flex" }}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Prescription number {i}</h5>
            <p className="card-text">Doctor: {user.doctorId.name}</p>
            <p className="card-text">
              Date: {new Date(user.date).toLocaleDateString("en-GB", {})}
            </p>
            <p className="card-text">Status: {user.status}</p>
            <div>
              <Tooltip title="View Details" placement="bottom">
                <IconButton onClick={() => handleView(user._id)}>
                  <VisibilityIcon></VisibilityIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="download" placement="bottom">
                <IconButton
                  onClick={() => handleDownload(user._id)}
                  type="submit"
                >
                  <FileDownloadIcon></FileDownloadIcon>
                </IconButton>
              </Tooltip>
              {user.status != "filled" && (
                <Tooltip title="buy" placement="bottom">
                  <IconButton onClick={() => handleBuy(user._id)} type="submit">
                    <ShoppingCartIcon></ShoppingCartIcon>
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

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
              My Prescriptions
            </h1>
          </div>
          <div className="card m-3 col-12" style={{ width: "80%", left: "8%" }}>
            <div className="card-body">
              <div style={{ display: "flex" }}>
                <div className="form-check" style={{ height: "2%" }}>
                  <input
                    ref={name}
                    style={{ marginTop: "15px" }}
                    className="form-check-input"
                    value="lolos"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                  />
                  <label
                    style={{ margin: "10px", marginRight: "50px" }}
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    Filter By doctor name
                  </label>
                </div>
                <div className="form-check" style={{}}>
                  <input
                    ref={date}
                    style={{ marginTop: "15px" }}
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked
                  />
                  <label
                    style={{ margin: "10px", marginRight: "50px" }}
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Filter by date
                  </label>
                </div>
                <div className="form-check">
                  <input
                    ref={status}
                    style={{ marginTop: "15px", marginLeft: "10px" }}
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault3"
                    checked
                  />
                  <label
                    style={{ margin: "10px", marginRight: "50px" }}
                    className="form-check-label"
                    htmlFor="flexRadioDefault3"
                  >
                    Filter by status
                  </label>
                </div>

                <div className="input-group mb-3" style={{ width: 250 }}>
                  <input
                    type="text"
                    ref={filter}
                    style={{ border: "1px solid black" }}
                    name="patientId"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                  />
                  <button
                    onClick={handleClick}
                    type="button"
                    className="btn btn-primary"
                  >
                    filter
                  </button>
                </div>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <CircularProgress color="success" />
                </div>
              ) : (
                <>
                  {data.length === 0 && filterMessage && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px",
                        color: "red",
                      }}
                    >
                      <p>{filterMessage}</p>
                    </div>
                  )}

                  {data.length > 0 && !filterMessage && (
                    <div className="image">{listo}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </AppBar>
      </div>
    </>
  );
}

export default PrescriptionsList;
