import AppBar from "@mui/material/AppBar";
import "../../App.css";
import imgSrc from "../../images/back.jpg";
import ResponsiveAppBar from "../../components/TopBarDoc";
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

        <img src={imgSrc} alt="" />

        <BottomBar />
      </AppBar>
    </div>
  );
}
export default homePage;
