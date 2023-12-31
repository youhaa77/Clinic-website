import AppBar from "@mui/material/AppBar";
import "../../App.css";
import ResponsiveAppBar from "../../components/TopBar";
import Ads from "../../components/Ads";
import BottomBar from "../../components/BottomBar";

function homePage() {
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

        <Ads />

        <BottomBar />
      </AppBar>
    </div>
  );
}
export default homePage;
