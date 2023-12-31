import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBarAdmin";
import BottomBar from "../../components/BottomBar";
const HealthPackage = () => {
  const [healthPackages, setHealthPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/healthPackage")
      .then((response) => {
        setHealthPackages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/admin/healthPackage/${id}`)
      .then((response) => {
        // Handle the response
        // You might want to remove the deleted item from your state as well
        setHealthPackages(
          healthPackages.filter((package1) => package1._id !== id)
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
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
            Health packages
          </h1>
        </div>
        <div
          className="card m-3 col-12"
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>doctor's session price discount:</th>
                    <th>medicin discount:</th>
                    <th>family subscribtion discount:</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {healthPackages.map((package1) => (
                    <tr key={package1._id}>
                      <td>{package1._id}</td>
                      <td>{package1.name}</td>
                      <td>{package1.price}</td>
                      <td>{package1.sessDiscount}</td>
                      <td>{package1.medDiscount}</td>
                      <td>{package1.subDiscount}</td>
                      <td>
                        <button type="submit" className="btn btn-primary" onClick={() => handleDelete(package1._id)}>
                          Delete
                        </button>
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
};


export default HealthPackage;