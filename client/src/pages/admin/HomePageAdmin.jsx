import AppBar from "@mui/material/AppBar";
import "../../App.css";
import imgSrc from "../../images/test.png";
import ResponsiveAppBar from "../../components/TopBarAdmin";

function homePageAdmin() {
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
      </AppBar>
    </div>
  );
}
export default homePageAdmin;
