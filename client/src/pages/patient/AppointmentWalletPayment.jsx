import { useEffect, useState } from "react";
import axios from "axios";
import ResponsiveAppBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import { AppBar } from "@mui/material";
import { Button } from "@mui/material";

function AppointmentWalletPayment() {
  const [wallet, setWallet] = useState();
  const [subscription, setSubscription] = useState("");
  const [discount, setDiscount] = useState();
  const [total, setTotal] = useState();
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const getPackageDiscount = async () => {
    try {
      const packageResponse = await axios.get(
        "http://localhost:8000/patient/healthPackage"
      );
      console.log(subscription);
      console.log("Package Response Data:", packageResponse.data.name);
      const healthPackage = packageResponse.data.find(
        (health) => health.name === subscription
      );
      console.log(healthPackage);

      if (healthPackage) {
        setDiscount(healthPackage.sessDiscount * 100);
        setTotal(100 - discount);
      } else {
        console.error(
          "Health package not found for subscription:",
          subscription
        );
        // Handle the case where healthPackage is not found
      }
    } catch (error) {
      console.error("Error fetching health package data:", error);
      // Handle error or set state accordingly
    }
  };
  const patientName = "test";

  useEffect(() => {
    const apiUrl = `http://localhost:8000/patient/getWallet/${patientName}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);
        setWallet(response.data); // Assuming response.data.wallet is a number
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred");
        setLoading(false);
      });
  }, [patientName]);

  const handlePayment = async () => {
    const patientIdFromHeader = "6523ba9cd72b2eb0e39cb137"; // Replace with your actual logic to get patient ID
    setButtonDisabled(true);
    try {
      // Make a request to your backend to update the wallet
      const response = await axios.put(
        `http://localhost:8000/patient/updateWallet`,
        {
          patientId: patientIdFromHeader,
          paymentAmount: -total,
        }
      );

      // Update the wallet state with the updated value from the response
      setWallet(response.data.updatedWallet);
    } catch (error) {
      console.error("Error updating wallet:", error);
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
        <div className="card m-3 col-12" style={{ width: "80%", left: "8%" }}>
          <h2>Payment Using Wallet</h2>
          <br></br>

          <div className="mb-3" style={{ textAlign: "left" }}>
            <label htmlFor="email" className="fs-4">
              <strong>Your current Wallet: </strong> {wallet} L.E.
            </label>
          </div>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <label htmlFor="email" className="fs-4">
              <strong>Doctor's session price: </strong> 100 L.E
            </label>
          </div>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <label htmlFor="email" className="fs-4">
              <strong>Your health package: </strong> {subscription} L.E.
            </label>
          </div>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <label htmlFor="email" className="fs-4">
              <strong>Your session discount: </strong> {discount} L.E.
            </label>
          </div>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <label htmlFor="email" className="fs-4">
              <strong>Total: </strong> {total} L.E.
            </label>
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handlePayment}
            disabled={isButtonDisabled}
          >
            Pay Now
          </Button>
        </div>
        <BottomBar />
      </AppBar>
    </div>
  );
}
export default AppointmentWalletPayment;
