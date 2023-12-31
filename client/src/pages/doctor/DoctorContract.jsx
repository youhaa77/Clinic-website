import { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarDoc";
import BottomBar from "../../components/BottomBar";

function DoctorContract() {
  {
    const [data, setData] = useState();
    const change2 = useRef(null);

    useEffect(() => {
      const apiUrl = "http://localhost:8000/doctor/contract";
      axios
        .get(apiUrl)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .put(" http://localhost:8000/doctor/acceptContract", {})
        .then((result) => {
          if (result.status === 200) {
            change2.current.style.display = "block";
          }
        })
        .catch((err) => console.log(err));
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
              borderRadius: "50px",
              margin: "10px",
              width: "40%",
              marginLeft: "30%",
            }}
          >
            <div
              style={{
                backgroundColor: " rgb(65, 105, 225)",
                borderRadius: "50px",
                margin: "10px",
                width: "80%",
                marginLeft: "10%",
                height: "60px",
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
                Contract
              </h1>
            </div>
            <div
              className="card m-3 col-12"
              style={{ width: "80%", left: "8%" }}
            >
              <div ref={change2} style={{ display: "none" }}>
                <div
                  style={{ height: "50px" }}
                  class="alert alert-primary d-flex align-items-center"
                  role="alert"
                >
                  <svg
                    class="bi flex-shrink-0 me-2"
                    role="img"
                    aria-label="Info:"
                  >
                    <use xlink:href="#info-fill" />
                  </svg>
                  <div>contract successfully accepted!</div>
                </div>
              </div>
              <form>
                <div>
                  {data && (
                    <div>
                      <p>Your hourly rate is: {data.hourlyRate} </p>
                      <p>
                        After adding the clinic 10% markup the session price
                        will be: {data.hourlyRate * 1.1}
                      </p>
                    </div>
                  )}
                </div>
                {data && data.status == "PendingContract" && (
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    class="btn btn-primary"
                  >
                    Accept
                  </button>
                )}
              </form>
            </div>
          </div>

          <BottomBar />
        </AppBar>
      </div>
    );
  }
}

export default DoctorContract;
